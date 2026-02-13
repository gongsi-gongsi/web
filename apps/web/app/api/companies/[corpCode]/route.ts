import { NextRequest, NextResponse } from 'next/server'
import { getCompanyInfo } from '@/entities/company/api/company-info/server'
import { prisma } from '@/shared/lib/prisma'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{
    corpCode: string
  }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { corpCode } = await params

  // 유효성 검사 - 8자리 숫자만 허용
  const corpCodeRegex = /^[0-9]{8}$/
  if (!corpCode || !corpCodeRegex.test(corpCode)) {
    return NextResponse.json(
      { error: 'Invalid corp_code. Must be exactly 8 numeric digits.' },
      { status: 400 }
    )
  }

  try {
    const data = await getCompanyInfo(corpCode)

    if (!data) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // 검색 로그 기록 (비동기, 실패 시 로그만 남김)
    const normalizedName = data.corpName.replace(/\(주\)|\(유\)|\(사\)$/g, '').trim()
    prisma.searchLog
      .create({ data: { query: normalizedName, corpCode } })
      .catch((err: unknown) => console.error('[SearchLog] Failed to record:', err))

    return NextResponse.json(data)
  } catch (error) {
    console.error(
      'Failed to fetch company info for corp:',
      corpCode,
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 })
  }
}
