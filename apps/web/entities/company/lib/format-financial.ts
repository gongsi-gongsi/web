import type { DartFinancialItem, FinancialData, Quarter, ReportCode } from '../model/types'
import { REPORT_CODE_INFO } from '../model/types'
import { findAccountKey, type AccountKey } from './account-mapping'

/**
 * 금액 문자열을 숫자로 변환합니다
 * @param amount - DART API에서 받은 금액 문자열
 * @returns 숫자 또는 null
 */
function parseAmount(amount: string | undefined): number | null {
  if (!amount || amount === '') return null
  const cleaned = amount.replace(/,/g, '')
  const num = Number(cleaned)
  return isNaN(num) ? null : num
}

/**
 * 기간 라벨을 생성합니다
 * @param year - 연도
 * @param quarter - 분기 (분기별 조회 시)
 * @returns '2024' 또는 '24.3Q' 형식
 */
function createLabel(year: number, quarter?: Quarter): string {
  if (!quarter) return String(year)
  const shortYear = String(year).slice(-2)
  return `${shortYear}.${quarter}`
}

interface ParsedFinancialData {
  year: number
  reportCode: ReportCode
  quarter?: Quarter
  accounts: Partial<Record<AccountKey, number | null>>
}

/**
 * DART API 응답에서 연결재무제표를 우선 선택합니다
 * @param items - DART API 응답 항목들
 * @returns 연결재무제표 또는 별도재무제표 항목들
 */
function selectFinancialStatements(items: DartFinancialItem[]): DartFinancialItem[] {
  const consolidated = items.filter(item => item.fs_div === 'CFS')
  if (consolidated.length > 0) return consolidated
  return items.filter(item => item.fs_div === 'OFS')
}

/**
 * DART API 응답을 파싱하여 연도별 데이터로 그룹화합니다
 * @param items - DART API 응답 항목들
 * @param reportCode - 보고서 코드
 * @returns 파싱된 재무 데이터 배열
 */
function parseDartResponse(
  items: DartFinancialItem[],
  reportCode: ReportCode
): ParsedFinancialData[] {
  const selected = selectFinancialStatements(items)
  if (selected.length === 0) return []

  const firstItem = selected[0]
  const baseYear = Number(firstItem.bsns_year)
  const quarter = REPORT_CODE_INFO[reportCode].quarter

  // 당기, 전기, 전전기 데이터 수집
  const yearsData: Map<number, Partial<Record<AccountKey, number | null>>> = new Map()

  for (const item of selected) {
    const accountKey = findAccountKey(item.account_nm)
    if (!accountKey) continue

    // 당기
    if (!yearsData.has(baseYear)) yearsData.set(baseYear, {})
    yearsData.get(baseYear)![accountKey] = parseAmount(item.thstrm_amount)

    // 전기
    if (!yearsData.has(baseYear - 1)) yearsData.set(baseYear - 1, {})
    yearsData.get(baseYear - 1)![accountKey] = parseAmount(item.frmtrm_amount)

    // 전전기
    if (!yearsData.has(baseYear - 2)) yearsData.set(baseYear - 2, {})
    yearsData.get(baseYear - 2)![accountKey] = parseAmount(item.bfefrmtrm_amount)
  }

  return Array.from(yearsData.entries()).map(([year, accounts]) => ({
    year,
    reportCode,
    quarter: reportCode === '11011' ? undefined : quarter,
    accounts,
  }))
}

/**
 * 파싱된 데이터를 FinancialData 형식으로 변환합니다
 * @param parsed - 파싱된 재무 데이터
 * @returns FinancialData
 */
function toFinancialData(parsed: ParsedFinancialData): FinancialData {
  return {
    year: parsed.year,
    quarter: parsed.quarter,
    reportCode: parsed.reportCode,
    label: createLabel(parsed.year, parsed.quarter),
    revenue: parsed.accounts.revenue ?? null,
    operatingProfit: parsed.accounts.operatingProfit ?? null,
    netIncome: parsed.accounts.netIncome ?? null,
    totalAssets: parsed.accounts.totalAssets ?? null,
    totalLiabilities: parsed.accounts.totalLiabilities ?? null,
    totalEquity: parsed.accounts.totalEquity ?? null,
  }
}

/**
 * DART API 응답을 앱 내부 모델로 변환합니다 (연도별)
 * @param items - DART API 응답 항목들
 * @param reportCode - 보고서 코드
 * @returns FinancialData 배열 (최신순 정렬)
 */
export function formatYearlyFinancials(
  items: DartFinancialItem[],
  reportCode: ReportCode = '11011'
): FinancialData[] {
  const parsed = parseDartResponse(items, reportCode)
  return parsed.map(toFinancialData).sort((a, b) => b.year - a.year)
}

/**
 * DART API 응답을 앱 내부 모델로 변환합니다 (분기별)
 * @param items - DART API 응답 항목들
 * @param year - 사업연도
 * @param reportCode - 보고서 코드
 * @returns FinancialData (당기 데이터만)
 */
export function formatQuarterlyFinancial(
  items: DartFinancialItem[],
  year: number,
  reportCode: ReportCode
): FinancialData | null {
  const selected = selectFinancialStatements(items)
  if (selected.length === 0) return null

  const quarter = REPORT_CODE_INFO[reportCode].quarter
  const accounts: Partial<Record<AccountKey, number | null>> = {}

  for (const item of selected) {
    const accountKey = findAccountKey(item.account_nm)
    if (!accountKey) continue
    accounts[accountKey] = parseAmount(item.thstrm_amount)
  }

  return {
    year,
    quarter,
    reportCode,
    label: createLabel(year, quarter),
    revenue: accounts.revenue ?? null,
    operatingProfit: accounts.operatingProfit ?? null,
    netIncome: accounts.netIncome ?? null,
    totalAssets: accounts.totalAssets ?? null,
    totalLiabilities: accounts.totalLiabilities ?? null,
    totalEquity: accounts.totalEquity ?? null,
  }
}

/**
 * 여러 연도의 데이터를 병합하고 최신 N개만 반환합니다
 * @param datasets - 여러 API 호출 결과
 * @param limit - 반환할 개수
 * @returns 병합된 FinancialData 배열
 */
export function mergeAndSliceYearly(datasets: FinancialData[][], limit: number): FinancialData[] {
  const merged = datasets.flat()
  const uniqueByYear = new Map<number, FinancialData>()

  // 같은 연도는 최신 데이터로 덮어쓰기
  for (const data of merged) {
    const existing = uniqueByYear.get(data.year)
    if (!existing || data.reportCode >= (existing.reportCode ?? '')) {
      uniqueByYear.set(data.year, data)
    }
  }

  return Array.from(uniqueByYear.values())
    .sort((a, b) => b.year - a.year)
    .slice(0, limit)
}
