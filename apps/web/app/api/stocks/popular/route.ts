export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getPopularCompaniesFromDB } from '@/entities/disclosure/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const parsedLimit = parseInt(searchParams.get('limit') || '10', 10)
    const limit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : Math.min(parsedLimit, 20)

    // 서버 전용 API 함수 사용
    const companies = await getPopularCompaniesFromDB(limit)

    return NextResponse.json(
      { companies },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('Error fetching popular companies:', error)
    return NextResponse.json({ error: 'Failed to fetch popular companies' }, { status: 500 })
  }
}
