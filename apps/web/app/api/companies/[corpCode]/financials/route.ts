import { NextRequest, NextResponse } from 'next/server'
import { getFinancials } from '@/entities/company/api/financials/server'
import type { FinancialViewMode } from '@/entities/company'

interface RouteParams {
  params: Promise<{
    corpCode: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { corpCode } = await params
  const { searchParams } = new URL(request.url)
  const mode = (searchParams.get('mode') || 'yearly') as FinancialViewMode

  // 유효성 검사 - 8자리 숫자만 허용
  const corpCodeRegex = /^[0-9]{8}$/
  if (!corpCode || !corpCodeRegex.test(corpCode)) {
    return NextResponse.json(
      { error: 'Invalid corp_code. Must be exactly 8 numeric digits.' },
      { status: 400 }
    )
  }

  if (mode !== 'yearly' && mode !== 'quarterly') {
    return NextResponse.json(
      { error: 'Invalid mode. Must be yearly or quarterly.' },
      { status: 400 }
    )
  }

  try {
    const data = await getFinancials(corpCode, mode)
    return NextResponse.json(data)
  } catch (error) {
    console.error(
      'Failed to fetch financials for corp:',
      corpCode,
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 })
  }
}
