import { NextRequest, NextResponse } from 'next/server'
import { formatDisclosure } from '@/entities/disclosure'
import type { DartApiResponse, Market, TodayDisclosuresResponse } from '@/entities/disclosure'

const DART_API_KEY = process.env.DART_API_KEY!

if (!DART_API_KEY) {
  throw new Error('DART_API_KEY is not defined in environment variables')
}

/**
 * 시장 구분을 DART API의 corp_cls 파라미터 값으로 변환합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex)
 * @returns DART API corp_cls 값 (Y: 유가증권, K: 코스닥, N: 코넥스, null: 전체)
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
    default:
      return null
  }
}

/**
 * 오늘 날짜를 YYYYMMDD 형식의 문자열로 반환합니다
 * @returns YYYYMMDD 형식의 날짜 문자열
 * @remarks 테스트를 위해 하루 전 날짜를 반환하도록 설정되어 있습니다
 */
function getTodayDateString(): string {
  const today = new Date()
  // 하루 전 날짜로 설정 (테스트용)
  today.setDate(today.getDate() - 1)
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = (searchParams.get('market') as Market) || 'all'

    const corpCls = getCorpClsFromMarket(market)
    const today = getTodayDateString()

    // DART API 호출
    const dartUrl = new URL('https://opendart.fss.or.kr/api/list.json')
    dartUrl.searchParams.append('crtfc_key', DART_API_KEY)
    dartUrl.searchParams.append('bgn_de', today)
    dartUrl.searchParams.append('end_de', today)
    if (corpCls) {
      dartUrl.searchParams.append('corp_cls', corpCls)
    }
    dartUrl.searchParams.append('sort', 'date')
    dartUrl.searchParams.append('sort_mth', 'desc')
    dartUrl.searchParams.append('page_count', '100')

    const response = await fetch(dartUrl.toString(), {
      next: {
        revalidate: 30, // 30초 캐시
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
          lastUpdated: new Date().toISOString(),
        } satisfies TodayDisclosuresResponse,
        { status: 200 }
      )
    }

    // 데이터 변환
    const disclosures = data.list.map(formatDisclosure)

    const result: TodayDisclosuresResponse = {
      disclosures,
      totalCount: disclosures.length,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching today disclosures:', error)
    return NextResponse.json({ error: 'Failed to fetch disclosures' }, { status: 500 })
  }
}
