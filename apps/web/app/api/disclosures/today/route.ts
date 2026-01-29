import { NextRequest, NextResponse } from 'next/server'
import { formatDisclosure } from '@/entities/disclosure'
import type { DartApiResponse, Market, TodayDisclosuresResponse } from '@/entities/disclosure'

const DART_API_KEY = process.env.DART_API_KEY!

if (!DART_API_KEY) {
  throw new Error('DART_API_KEY is not defined in environment variables')
}

function getCorpClsFromMarket(market: Market): string {
  switch (market) {
    case 'all':
      return 'Y'
    case 'kospi':
      return 'K'
    case 'kosdaq':
      return 'N'
    case 'konex':
      return 'E'
    default:
      return 'Y'
  }
}

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
    dartUrl.searchParams.append('corp_cls', corpCls)
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
