import { NextRequest, NextResponse } from 'next/server'
import { formatDisclosure } from '@/entities/disclosure'
import type {
  DartApiResponse,
  Market,
  DisclosureType,
  SearchPeriod,
  Disclosure,
} from '@/entities/disclosure'
import { searchCorpCodes } from '@/shared/lib/dart/apis/search-stocks'
import { getDartApiKey, getCorpClsFromMarket, formatDateToYYYYMMDD } from '@/shared/lib/dart/utils'

/**
 * SearchPeriod를 YYYYMMDD 형식의 시작/종료 날짜로 변환합니다
 * @param period - 검색 기간 (today | 1w | 1m | 3m | custom)
 * @param bgnDe - custom 기간의 시작 날짜 (YYYYMMDD)
 * @param endDe - custom 기간의 종료 날짜 (YYYYMMDD)
 * @returns [시작 날짜, 종료 날짜] (YYYYMMDD 형식)
 */
function getDateRange(period: SearchPeriod, bgnDe?: string, endDe?: string): [string, string] {
  const today = new Date()
  const endDate = formatDateToYYYYMMDD(today)

  switch (period) {
    case 'today':
      return [endDate, endDate]
    case '1w': {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return [formatDateToYYYYMMDD(weekAgo), endDate]
    }
    case '1m': {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return [formatDateToYYYYMMDD(monthAgo), endDate]
    }
    case '3m': {
      const threeMonthsAgo = new Date(today)
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      return [formatDateToYYYYMMDD(threeMonthsAgo), endDate]
    }
    case 'custom': {
      if (!bgnDe || !endDe) {
        throw new Error('bgnDe and endDe are required for custom period')
      }
      return [bgnDe, endDe]
    }
    default:
      return [endDate, endDate]
  }
}

/**
 * 단일 corp_code에 대해 DART list.json API를 호출합니다
 * @param params - API 호출 파라미터
 * @returns DART API 응답
 */
async function fetchDartDisclosures(params: {
  corpCode: string
  startDate: string
  endDate: string
  corpCls: string | null
  type: DisclosureType | 'all'
  pageNo: string
  pageCount: string
}): Promise<DartApiResponse> {
  const dartUrl = new URL('https://opendart.fss.or.kr/api/list.json')
  dartUrl.searchParams.append('crtfc_key', getDartApiKey())
  dartUrl.searchParams.append('corp_code', params.corpCode)
  dartUrl.searchParams.append('bgn_de', params.startDate)
  dartUrl.searchParams.append('end_de', params.endDate)
  if (params.corpCls) {
    dartUrl.searchParams.append('corp_cls', params.corpCls)
  }
  if (params.type !== 'all') {
    dartUrl.searchParams.append('pblntf_ty', params.type)
  }
  dartUrl.searchParams.append('sort', 'date')
  dartUrl.searchParams.append('sort_mth', 'desc')
  dartUrl.searchParams.append('page_no', params.pageNo)
  dartUrl.searchParams.append('page_count', params.pageCount)

  const response = await fetch(dartUrl.toString(), {
    next: {
      revalidate: 60,
      tags: ['disclosures', 'search'],
    },
  })

  if (!response.ok) {
    throw new Error(`DART API error: ${response.status}`)
  }

  return response.json()
}

/**
 * 빈 검색 결과 응답을 생성합니다
 * @param q - 검색어
 * @param pageNo - 페이지 번호
 * @param pageCount - 페이지당 건수
 * @returns 빈 결과 JSON 응답
 */
function emptyResponse(q: string, pageNo: number, pageCount: number) {
  return NextResponse.json({
    disclosures: [],
    totalCount: 0,
    totalPage: 0,
    pageNo,
    pageCount,
    lastUpdated: new Date().toISOString(),
    query: q,
  })
}

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

    if (!q) {
      return emptyResponse(q, Number(pageNo), Number(pageCount))
    }

    // 1. 회사명으로 corp_code 검색
    const matchedCorps = await searchCorpCodes(q)

    if (matchedCorps.length === 0) {
      return emptyResponse(q, Number(pageNo), Number(pageCount))
    }

    const corpCls = getCorpClsFromMarket(market)
    const [startDate, endDate] = getDateRange(period, bgnDe, endDe)

    // 2. 단일 회사 매칭: 기존 페이지네이션 유지
    if (matchedCorps.length === 1) {
      const data = await fetchDartDisclosures({
        corpCode: matchedCorps[0].corpCode,
        startDate,
        endDate,
        corpCls,
        type,
        pageNo,
        pageCount: '100',
      })

      if (data.status !== '000') {
        return emptyResponse(q, Number(pageNo), Number(pageCount))
      }

      const overrideType = type !== 'all' ? type : undefined
      const disclosures = data.list.map(item => formatDisclosure(item, overrideType))

      return NextResponse.json({
        disclosures,
        totalCount: data.total_count,
        totalPage: data.total_page,
        pageNo: data.page_no,
        pageCount: data.page_count,
        lastUpdated: new Date().toISOString(),
        query: q,
      })
    }

    // 3. 복수 회사 매칭 (최대 5개): 병렬 호출 후 합산
    const results = await Promise.all(
      matchedCorps.map(corp =>
        fetchDartDisclosures({
          corpCode: corp.corpCode,
          startDate,
          endDate,
          corpCls,
          type,
          pageNo: '1',
          pageCount: '100',
        })
      )
    )

    const overrideTypeAll = type !== 'all' ? type : undefined
    const seen = new Set<string>()
    const allDisclosures: Disclosure[] = results
      .filter(data => data.status === '000')
      .flatMap(data => data.list.map(item => formatDisclosure(item, overrideTypeAll)))
      .filter(d => {
        if (seen.has(d.id)) return false
        seen.add(d.id)
        return true
      })
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))

    return NextResponse.json({
      disclosures: allDisclosures,
      totalCount: allDisclosures.length,
      totalPage: 1,
      pageNo: 1,
      pageCount: allDisclosures.length,
      lastUpdated: new Date().toISOString(),
      query: q,
    })
  } catch (error) {
    console.error('Error searching disclosures:', error)
    return NextResponse.json({ error: 'Failed to search disclosures' }, { status: 500 })
  }
}
