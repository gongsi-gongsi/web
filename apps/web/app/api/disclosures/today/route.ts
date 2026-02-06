import { NextRequest, NextResponse } from 'next/server'
import {
  getTodayDisclosuresFromDart,
  getTodayDisclosuresFromDartPaginated,
  type Market,
} from '@/entities/disclosure/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = (searchParams.get('market') as Market) || 'all'
    const pageNo = searchParams.get('page_no')
    const pageCount = searchParams.get('page_count')
    const limit = searchParams.get('limit')

    // 페이지네이션 파라미터가 있으면 페이지네이션 API 사용
    if (pageNo || pageCount) {
      const result = await getTodayDisclosuresFromDartPaginated(
        market,
        pageNo ? Number(pageNo) : 1,
        pageCount ? Number(pageCount) : 20
      )
      return NextResponse.json(result)
    }

    // 페이지네이션 파라미터가 없으면 전체 조회 API 사용
    const result = await getTodayDisclosuresFromDart(market, limit ? Number(limit) : undefined)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching today disclosures:', error)
    return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 })
  }
}
