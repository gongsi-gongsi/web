import { NextRequest, NextResponse } from 'next/server'

import { getMajorMarketNews } from '@/entities/news/server'

/**
 * limit 파라미터를 검증하고 안전한 값을 반환합니다
 * @param value - 쿼리 파라미터 값
 * @param defaultValue - 기본값
 * @param min - 최소값
 * @param max - 최대값
 * @returns 검증된 숫자 값
 */
function validateLimit(value: string | null, defaultValue: number, min = 1, max = 100): number {
  if (!value) return defaultValue

  const parsed = Number(value)

  // NaN, Infinity, 범위 밖 체크
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return defaultValue
  }

  return Math.floor(parsed) // 정수로 변환
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = validateLimit(searchParams.get('limit'), 6, 1, 50)

    const data = await getMajorMarketNews(limit)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Major news API error:', error)
    return NextResponse.json({ error: 'Failed to fetch major market news' }, { status: 500 })
  }
}
