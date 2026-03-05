import { getDartApiKey } from '@/shared/lib/dart/utils'

import {
  formatYearlyFinancials,
  formatQuarterlyFinancial,
  mergeAndSliceYearly,
} from '../../lib/format-financial'
import type {
  DartFinancialResponse,
  FinancialData,
  FinancialViewMode,
  FinancialStatementsResponse,
  Quarter,
  ReportCode,
} from '../../model/types'
import { getProvisionalFinancial } from './provisional'

/** 분기 정렬용 순서 */
const QUARTER_ORDER: Record<Quarter, number> = { '1Q': 1, '2Q': 2, '3Q': 3, '4Q': 4 }

/** 누적값 → 분기 단독값 변환 대상 (손익계산서 항목만) */
const INCOME_KEYS = ['revenue', 'operatingProfit', 'netIncome'] as const
type IncomeKey = (typeof INCOME_KEYS)[number]


/**
 * DART `fnlttSinglAcnt` API의 4Q(사업보고서) 손익 데이터를 분기 단독값으로 변환합니다
 *
 * DART API 반환 방식:
 * - 1Q / 2Q(반기) / 3Q: thstrm_amount = 해당 분기 단독값 (이미 standalone)
 * - 4Q (사업보고서):    thstrm_amount = 연간 누적값 (연간 전체)
 *
 * 따라서 4Q 단독값 = 연간 - Q1 - Q2 - Q3 (같은 연도 데이터 필요)
 * Q1/Q2/Q3 중 하나라도 없으면 계산 불가 → 해당 항목 null 처리
 *
 * @param data - 분기별 재무 데이터 배열
 * @returns 4Q 손익 항목이 분기 단독값으로 변환된 배열
 */
function convertCumulativeToStandalone(data: FinancialData[]): FinancialData[] {
  // 같은 연도의 1Q~3Q 단독값을 조회용으로 스냅샷
  const byQuarter = new Map<string, Pick<FinancialData, IncomeKey>>()
  for (const d of data) {
    if (d.quarter && !d.isProvisional) {
      byQuarter.set(`${d.year}-${d.quarter}`, {
        revenue: d.revenue,
        operatingProfit: d.operatingProfit,
        netIncome: d.netIncome,
      })
    }
  }

  return data.map(d => {
    // 잠정실적은 이미 분기 단독값
    if (d.isProvisional) return d
    // 4Q(사업보고서)만 변환 대상 — 1Q/2Q/3Q는 DART가 이미 단독값으로 반환
    if (!d.quarter || d.quarter !== '4Q') return d

    const q1 = byQuarter.get(`${d.year}-1Q`)
    const q2 = byQuarter.get(`${d.year}-2Q`)
    const q3 = byQuarter.get(`${d.year}-3Q`)

    // 1Q~3Q 중 하나라도 없으면 계산 불가
    if (!q1 || !q2 || !q3) return d

    const updated = { ...d }
    for (const key of INCOME_KEYS) {
      const annual = d[key]
      const q1Val = q1[key]
      const q2Val = q2[key]
      const q3Val = q3[key]

      if (annual !== null && q1Val !== null && q2Val !== null && q3Val !== null) {
        updated[key] = annual - q1Val - q2Val - q3Val
      } else {
        updated[key] = null
      }
    }
    return updated
  })
}

/**
 * 재무 데이터를 시간순(오름차순)으로 정렬합니다
 * @param data - 재무 데이터 배열
 * @returns 시간순 정렬된 배열
 */
function sortChronological(data: FinancialData[]): FinancialData[] {
  return data.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    const aQ = a.quarter ? QUARTER_ORDER[a.quarter] : 4
    const bQ = b.quarter ? QUARTER_ORDER[b.quarter] : 4
    return aQ - bQ
  })
}

/**
 * DART API에서 단일회사 주요계정을 조회합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @param bsnsYear - 사업연도
 * @param reprtCode - 보고서 코드
 * @returns DART API 응답
 */
async function fetchDartFinancials(
  corpCode: string,
  bsnsYear: number,
  reprtCode: ReportCode
): Promise<DartFinancialResponse> {
  const dartUrl = new URL('https://opendart.fss.or.kr/api/fnlttSinglAcnt.json')
  dartUrl.searchParams.append('crtfc_key', getDartApiKey())
  dartUrl.searchParams.append('corp_code', corpCode)
  dartUrl.searchParams.append('bsns_year', String(bsnsYear))
  dartUrl.searchParams.append('reprt_code', reprtCode)

  const response = await fetch(dartUrl.toString(), {
    next: {
      revalidate: 86400, // 1일 캐시
      tags: ['financial', corpCode],
    },
  })

  if (!response.ok) {
    throw new Error(`DART API error: ${response.status}`)
  }

  return response.json()
}

/**
 * 최근 8개 분기 정보를 계산합니다
 * 보고서 공시 시점: 1Q(5월), 반기(8월), 3Q(11월), 사업보고서(3월)
 * @returns 분기 정보 배열 [{year, code}, ...]
 */
function getRecentQuarters(): Array<{ year: number; code: ReportCode }> {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const quarters: Array<{ year: number; code: ReportCode }> = []

  // 보고서 순서: 3Q(11월) → 반기(8월) → 1Q(5월) → 사업(3월, 전년도 실적)
  const reportCodes: ReportCode[] = ['11014', '11012', '11013', '11011']

  let year: number
  let reportIdx: number

  // 현재 월 기준으로 가장 최근 공시된 보고서 결정
  if (currentMonth >= 11) {
    // 11월 이후: 당해 3Q 공시됨
    year = currentYear
    reportIdx = 0 // 3Q
  } else if (currentMonth >= 8) {
    // 8-10월: 당해 반기 공시됨
    year = currentYear
    reportIdx = 1 // 반기
  } else if (currentMonth >= 5) {
    // 5-7월: 당해 1Q 공시됨
    year = currentYear
    reportIdx = 2 // 1Q
  } else if (currentMonth >= 4) {
    // 4월: 전년도 사업보고서 공시됨
    year = currentYear - 1
    reportIdx = 3 // 사업보고서
  } else {
    // 1-3월: 전년도 3Q가 가장 최근
    year = currentYear - 1
    reportIdx = 0 // 전년도 3Q
  }

  for (let i = 0; i < 8; i++) {
    const code = reportCodes[reportIdx]
    // 사업보고서는 전년도 실적이므로 year 그대로, 나머지도 해당 year의 실적
    quarters.push({ year, code })

    // 다음(과거) 분기로 이동
    reportIdx++
    if (reportIdx >= 4) {
      reportIdx = 0
      year--
    }
  }

  return quarters
}

/**
 * 가장 최신 사업보고서의 사업연도를 계산합니다
 * 사업보고서는 3월에 전년도 실적이 공시됩니다
 * @returns 조회 가능한 가장 최신 사업연도
 */
function getLatestAnnualReportYear(): number {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // 4월 이후면 전년도 사업보고서가 공시됨
  // 3월 이전이면 전전년도가 가장 최신
  return currentMonth >= 4 ? currentYear - 1 : currentYear - 2
}

/**
 * [서버 전용] 연도별 재무제표를 조회합니다 (최근 5년)
 * 정기공시 데이터가 없는 최신 연도는 4분기 잠정실적으로 보완합니다
 * @param corpCode - 기업 고유번호
 * @returns 연도별 재무 데이터
 */
export async function getYearlyFinancials(corpCode: string): Promise<FinancialStatementsResponse> {
  const latestYear = getLatestAnnualReportYear()

  // 2번 호출로 5년치 확보 (3년 + 3년, 중복 제거)
  // 예: latestYear=2024 → 2024(→2024,2023,2022), 2021(→2021,2020,2019)
  const [recentResponse, olderResponse] = await Promise.all([
    fetchDartFinancials(corpCode, latestYear, '11011'),
    fetchDartFinancials(corpCode, latestYear - 3, '11011'),
  ])

  const datasets: FinancialData[][] = []

  if (recentResponse.status === '000' && recentResponse.list) {
    datasets.push(formatYearlyFinancials(recentResponse.list, '11011'))
  }

  if (olderResponse.status === '000' && olderResponse.list) {
    datasets.push(formatYearlyFinancials(olderResponse.list, '11011'))
  }

  const data = mergeAndSliceYearly(datasets, 6)

  // 잠정실적 fallback: 다음 연도 4분기 잠정실적으로 보완
  const nextYear = latestYear + 1
  try {
    const provisionalData = await getProvisionalFinancial(corpCode, nextYear, '4Q', {
      cumulative: true,
    })
    if (provisionalData) {
      // 연도별 뷰에 맞게 label 변환 (25.4Q → 2025)
      data.unshift({
        ...provisionalData,
        quarter: undefined,
        label: String(nextYear),
      })
    }
  } catch (error) {
    console.error('연도별 잠정실적 fallback 실패:', error)
  }

  return {
    corpCode,
    mode: 'yearly',
    data: sortChronological(data),
  }
}

/**
 * 가장 최신 재무 데이터의 다음 분기를 계산합니다
 * @param latest - 가장 최신 재무 데이터
 * @returns 다음 분기의 연도와 분기, 또는 null
 */
function getNextQuarter(latest: FinancialData): { year: number; quarter: Quarter } | null {
  if (!latest.quarter) return null

  const quarterOrder: Quarter[] = ['1Q', '2Q', '3Q', '4Q']
  const currentIdx = quarterOrder.indexOf(latest.quarter)

  if (currentIdx === 3) {
    return { year: latest.year + 1, quarter: '1Q' }
  }

  return { year: latest.year, quarter: quarterOrder[currentIdx + 1] }
}

/**
 * [서버 전용] 분기별 재무제표를 조회합니다 (최근 8분기)
 * 정기공시 데이터가 없는 최신 분기는 잠정실적으로 보완합니다
 * @param corpCode - 기업 고유번호
 * @returns 분기별 재무 데이터
 */
export async function getQuarterlyFinancials(
  corpCode: string
): Promise<FinancialStatementsResponse> {
  const quarters = getRecentQuarters()

  const responses = await Promise.all(
    quarters.map(({ year, code }) => fetchDartFinancials(corpCode, year, code))
  )

  const data: FinancialData[] = []

  responses.forEach((response, idx) => {
    if (response.status === '000' && response.list) {
      const quarterData = formatQuarterlyFinancial(
        response.list,
        quarters[idx].year,
        quarters[idx].code
      )
      if (quarterData) {
        data.push(quarterData)
      }
    }
  })

  // DART 누적값 → 분기 단독값 변환 (손익 항목: 매출, 영업이익, 순이익)
  // 잠정실적 fallback 추가 전에 변환해야 원본 누적값 기준으로 정확히 계산됨
  const standaloneData = convertCumulativeToStandalone(data)

  // 잠정실적 fallback: 최신 분기가 없으면 잠정실적으로 보완
  if (standaloneData.length > 0) {
    const next = getNextQuarter(standaloneData[0])
    if (next) {
      try {
        const provisionalData = await getProvisionalFinancial(corpCode, next.year, next.quarter)
        if (provisionalData) {
          standaloneData.unshift(provisionalData)
        }
      } catch (error) {
        console.error('잠정실적 fallback 실패:', error)
      }
    }
  }

  return {
    corpCode,
    mode: 'quarterly',
    data: sortChronological(standaloneData),
  }
}

/**
 * [서버 전용] 재무제표를 조회합니다
 * @param corpCode - 기업 고유번호
 * @param mode - 조회 모드 (yearly | quarterly)
 * @returns 재무 데이터
 */
export async function getFinancials(
  corpCode: string,
  mode: FinancialViewMode = 'yearly'
): Promise<FinancialStatementsResponse> {
  if (mode === 'quarterly') {
    return getQuarterlyFinancials(corpCode)
  }
  return getYearlyFinancials(corpCode)
}
