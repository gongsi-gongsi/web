import { NextRequest, NextResponse } from 'next/server'
import { formatDisclosure } from '@/entities/disclosure'
import type { DartApiResponse, Market } from '@/entities/disclosure'

/**
 * DART API 키를 환경변수에서 가져옵니다
 * @returns DART API 키
 * @throws 환경변수가 설정되지 않은 경우 에러
 */
function getDartApiKey(): string {
  const apiKey = process.env.DART_API_KEY
  if (!apiKey) {
    throw new Error('DART_API_KEY is not defined in environment variables')
  }
  return apiKey
}

/**
 * 시장 구분을 DART API의 corp_cls 파라미터 값으로 변환합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex)
 * @returns DART API corp_cls 값 (Y: 유가, K: 코스닥, N: 코넥스, null: 전체)
 */
function getCorpClsFromMarket(market: Market): string | null {
  switch (market) {
    case 'all':
      return null // 전체 조회 시 파라미터 생략
    case 'kospi':
      return 'Y' // 유가증권
    case 'kosdaq':
      return 'K' // 코스닥
    case 'konex':
      return 'N' // 코넥스
    case 'etc':
      return 'E' // 기타
    default:
      return null
  }
}

/**
 * 오늘 날짜를 YYYYMMDD 형식의 문자열로 반환합니다
 * @returns YYYYMMDD 형식의 날짜 문자열 (KST 기준)
 */
function getTodayDateString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = (searchParams.get('market') as Market) || 'all'
    const pageNo = searchParams.get('page_no') || '1'
    const pageCount = searchParams.get('page_count') || '100'

    const corpCls = getCorpClsFromMarket(market)
    const today = getTodayDateString()

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

    // 데이터 변환
    const disclosures = data.list.map(formatDisclosure)

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
