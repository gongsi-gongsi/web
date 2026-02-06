export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import {
  searchDisclosuresFromDart,
  type Market,
  type DisclosureType,
  type SearchPeriod,
} from '@/entities/disclosure/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const period = (searchParams.get('period') as SearchPeriod) || '1w'
    const bgnDe = searchParams.get('bgn_de') || undefined
    const endDe = searchParams.get('end_de') || undefined
    const market = (searchParams.get('market') as Market) || 'all'
    const type = (searchParams.get('type') as DisclosureType | 'all') || 'all'
    const pageNo = searchParams.get('page_no') || '1'
    const pageCount = searchParams.get('page_count') || '100'

    // 서버 전용 API 함수 사용
    const result = await searchDisclosuresFromDart({
      q,
      period,
      bgnDe,
      endDe,
      market,
      type,
      pageNo: Number(pageNo),
      pageCount: Number(pageCount),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error searching disclosures:', error)
    return NextResponse.json({ error: 'Failed to search disclosures' }, { status: 500 })
  }
}
