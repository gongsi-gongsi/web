export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'

interface RouteParams {
  params: Promise<{
    corpCode: string
  }>
}

const CORP_CODE_REGEX = /^[0-9]{8}$/

/**
 * 특정 기업이 현재 사용자의 관심 종목에 등록되어 있는지 확인합니다
 * 비로그인 상태에서도 에러 없이 { isWatchlisted: false }를 반환합니다
 * @param corpCode - DART 기업 고유번호 (8자리 숫자)
 * @returns { isWatchlisted: boolean }
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { corpCode } = await params

  if (!corpCode || !CORP_CODE_REGEX.test(corpCode)) {
    return NextResponse.json(
      { error: 'Invalid corpCode. Must be exactly 8 numeric digits.' },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 비로그인 시 isWatchlisted: false 반환
  if (!user) {
    return NextResponse.json({ isWatchlisted: false })
  }

  try {
    const stock = await prisma.stock.findUnique({
      where: { corpCode },
      select: { id: true },
    })

    if (!stock) {
      return NextResponse.json({ isWatchlisted: false })
    }

    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_stockId: {
          userId: user.id,
          stockId: stock.id,
        },
      },
      select: { id: true },
    })

    return NextResponse.json({ isWatchlisted: watchlistItem !== null })
  } catch (error) {
    console.error(
      'Failed to check watchlist for corp:',
      corpCode,
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json({ error: 'Failed to check watchlist' }, { status: 500 })
  }
}
