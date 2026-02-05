import { getDartApiKey, getCorpClsFromMarket, formatDateToYYYYMMDD } from '@/shared/lib/dart/utils'
import { formatDisclosure } from '../lib/format-disclosure'
import type {
  Market,
  TodayDisclosuresResponse,
  PaginatedDisclosuresResponse,
  DartApiResponse,
} from '../model/types'

/**
 * [서버 전용] DART API로부터 오늘의 공시 목록을 직접 조회합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex | etc)
 * @returns 공시 목록과 메타데이터
 * @throws {Error} DART API 호출 실패 시
 */
export async function getTodayDisclosuresFromDart(
  market: Market = 'all'
): Promise<TodayDisclosuresResponse> {
  const corpCls = getCorpClsFromMarket(market)
  const today = formatDateToYYYYMMDD(new Date())

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
  dartUrl.searchParams.append('page_no', '1')
  dartUrl.searchParams.append('page_count', '100')

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
    return {
      disclosures: [],
      totalCount: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  // 데이터 변환 (지분공시 제외)
  const disclosures = data.list.map(item => formatDisclosure(item)).filter(d => d.type !== 'D')

  return {
    disclosures,
    totalCount: data.total_count,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * [서버 전용] DART API로부터 오늘의 공시 목록을 페이지네이션하여 조회합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex | etc)
 * @param pageNo - 페이지 번호 (1부터 시작)
 * @param pageCount - 페이지당 건수
 * @returns 페이지네이션 메타데이터가 포함된 공시 목록
 * @throws {Error} DART API 호출 실패 시
 */
export async function getTodayDisclosuresFromDartPaginated(
  market: Market = 'all',
  pageNo: number = 1,
  pageCount: number = 20
): Promise<PaginatedDisclosuresResponse> {
  const corpCls = getCorpClsFromMarket(market)
  const today = formatDateToYYYYMMDD(new Date())

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
  dartUrl.searchParams.append('page_no', String(pageNo))
  dartUrl.searchParams.append('page_count', String(pageCount))

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
    return {
      disclosures: [],
      totalCount: 0,
      totalPage: 0,
      pageNo,
      pageCount,
      lastUpdated: new Date().toISOString(),
    }
  }

  // 데이터 변환 (지분공시 제외)
  const disclosures = data.list.map(item => formatDisclosure(item)).filter(d => d.type !== 'D')

  return {
    disclosures,
    totalCount: data.total_count,
    totalPage: data.total_page,
    pageNo: data.page_no,
    pageCount: data.page_count,
    lastUpdated: new Date().toISOString(),
  }
}
