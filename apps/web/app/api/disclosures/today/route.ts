import { NextRequest, NextResponse } from 'next/server'
import { formatDisclosure } from '@/entities/disclosure'
import type { DartApiResponse, Market } from '@/entities/disclosure'
import { getDartApiKey, getCorpClsFromMarket, formatDateToYYYYMMDD } from '@/shared/lib/dart/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = (searchParams.get('market') as Market) || 'all'
    const pageNo = searchParams.get('page_no') || '1'
    const pageCount = searchParams.get('page_count') || '100'

    const corpCls = getCorpClsFromMarket(market)
    // TODO: 테스트용 - 하루 이전 날짜로 조회
    const testDate = new Date()
    testDate.setDate(testDate.getDate() - 1)
    const today = formatDateToYYYYMMDD(testDate)

    // DART API 호출
    const dartUrl = new URL('https://opendart.fss.or.kr/api/list.json')
    dartUrl.searchParams.append('crtfc_key', getDartApiKey())
    dartUrl.searchParams.append('bgn_de', today)
    dartUrl.searchParams.append('end_de', today)
    if (corpCls) {
      dartUrl.searchParams.append('corp_cls', corpCls)
    }
    dartUrl.searchParams.append('sort', 'date')
    dartUrl.searchParams.append('sort_mth', 'desc')
    dartUrl.searchParams.append('page_no', pageNo)
    dartUrl.searchParams.append('page_count', pageCount)

    const response = await fetch(dartUrl.toString(), {
      next: {
        revalidate: 60, // 1분 캐시
        tags: ['disclosures', 'today', market],
      },
    })

    if (!response.ok) {
      throw new Error(`DART API error: ${response.status}`)
    }

    const data: DartApiResponse = await response.json()

    // 에러 응답 처리
    if (data.status !== '000') {
      // status 000: 정상
      return NextResponse.json(
        {
          disclosures: [],
          totalCount: 0,
          totalPage: 0,
          pageNo: Number(pageNo),
          pageCount: Number(pageCount),
          lastUpdated: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    // 데이터 변환 (지분공시 제외 — DART 웹사이트 기본 동작과 동일)
    const disclosures = data.list.map(item => formatDisclosure(item)).filter(d => d.type !== 'D')

    return NextResponse.json({
      disclosures,
      totalCount: data.total_count,
      totalPage: data.total_page,
      pageNo: data.page_no,
      pageCount: data.page_count,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching today disclosures:', error)
    return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 })
  }
}
