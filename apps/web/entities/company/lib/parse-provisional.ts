import { parse as parseHTML } from 'node-html-parser'
import AdmZip from 'adm-zip'

import type { FinancialData, Quarter, ReportCode } from '../model/types'
import { findAccountKey, type AccountKey } from './account-mapping'

/** 분기 → 보고서 코드 매핑 */
const QUARTER_TO_REPORT_CODE: Record<Quarter, ReportCode> = {
  '1Q': '11013',
  '2Q': '11012',
  '3Q': '11014',
  '4Q': '11011',
}

/**
 * 잠정실적 공시 ZIP에서 HTML 문서를 추출합니다
 * @param zipBuffer - DART document.xml API로 다운로드한 ZIP 버퍼
 * @returns HTML 문서 문자열
 */
function extractHtmlFromZip(zipBuffer: Buffer): string {
  const zip = new AdmZip(zipBuffer)
  const entries = zip.getEntries()

  if (entries.length === 0) {
    throw new Error('ZIP 파일에 문서가 없습니다')
  }

  return entries[0].getData().toString('utf8')
}

/**
 * 실적기간 종료일로부터 분기를 판정합니다
 * @param endDate - 종료일 문자열 (YYYY.MM.DD 또는 YYYY-MM-DD 형식)
 * @returns 분기
 */
function determineQuarter(endDate: string): Quarter {
  const month = parseInt(endDate.replace(/[.\-/]/g, '').substring(4, 6), 10)

  if (month <= 3) return '1Q'
  if (month <= 6) return '2Q'
  if (month <= 9) return '3Q'
  return '4Q'
}

/**
 * 잠정실적 금액 문자열을 숫자로 변환합니다
 * @param text - 금액 문자열 (콤마 포함)
 * @returns 숫자 또는 null
 */
function parseAmount(text: string): number | null {
  const cleaned = text.replace(/,/g, '').replace(/\s/g, '').trim()
  if (!cleaned || cleaned === '-' || cleaned === '') return null
  const num = Number(cleaned)
  return isNaN(num) ? null : num
}

/**
 * 단위 문자열에서 곱수를 반환합니다
 * @param unitText - 단위 텍스트 (예: "백만원", "조원")
 * @returns 곱수
 */
function getUnitMultiplier(unitText: string): number {
  if (unitText.includes('조원')) return 1_000_000_000_000
  if (unitText.includes('억원')) return 100_000_000
  if (unitText.includes('백만원')) return 1_000_000
  if (unitText.includes('천원')) return 1_000
  return 1
}

/**
 * 잠정실적 공시 HTML을 파싱하여 FinancialData로 변환합니다
 * @param zipBuffer - DART document.xml API로 다운로드한 ZIP 버퍼
 * @returns FinancialData (isProvisional: true) 또는 null
 */
export function parseProvisionalDisclosure(zipBuffer: Buffer): FinancialData | null {
  const html = extractHtmlFromZip(zipBuffer)
  const root = parseHTML(html)

  // 1. 실적기간 파싱 - Table0에서 당기실적 기간 추출
  const periodTable = root.querySelector('#XFormD1_Form0_Table0')
  if (!periodTable) return null

  const periodInputs = periodTable.querySelectorAll('.xforms_input')
  if (periodInputs.length < 2) return null

  // 첫 번째 행 (당기실적): 시작일, 종료일
  const endDateText = periodInputs[1]?.text?.trim() ?? ''
  if (!endDateText) return null

  const quarter = determineQuarter(endDateText)
  const yearMatch = endDateText.match(/(\d{4})/)
  if (!yearMatch) return null
  const year = parseInt(yearMatch[1], 10)

  // 2. 실적 데이터 파싱 - RepeatTable0
  const dataTable = root.querySelector('#XFormD1_Form0_RepeatTable0')
  if (!dataTable) return null

  // 단위 파싱
  const allTexts = dataTable.text
  const unitMatch = allTexts.match(/단위\s*[:：]\s*([^,，]+)/)
  const unitText = unitMatch?.[1]?.trim() ?? '백만원'
  const multiplier = getUnitMultiplier(unitText)

  // 테이블 행 순회하며 재무 항목 추출
  const rows = dataTable.querySelectorAll('tr')
  const accounts: Partial<Record<AccountKey, number | null>> = {}

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.querySelectorAll('td')
    if (cells.length < 3) continue

    // 항목명 (첫 번째 셀) - rowspan=2인 셀이 항목명
    const firstCellText = cells[0]?.text?.trim() ?? ''

    // 잠정실적 표준 항목명 매핑
    const accountKey = findProvisionalAccountKey(firstCellText)
    if (!accountKey) continue

    // "당해실적" 행인지 확인 (두 번째 셀)
    const secondCellText = cells[1]?.text?.trim() ?? ''
    if (!secondCellText.includes('당해')) continue

    // 당기실적 값 (세 번째 셀의 xforms_input)
    const valueSpan = cells[2]?.querySelector('.xforms_input')
    const valueText = valueSpan?.text?.trim() ?? cells[2]?.text?.trim() ?? ''
    const amount = parseAmount(valueText)

    accounts[accountKey] = amount !== null ? amount * multiplier : null
  }

  // 최소 하나의 항목이 있어야 유효
  if (Object.keys(accounts).length === 0) return null

  const reportCode = QUARTER_TO_REPORT_CODE[quarter]
  const shortYear = String(year).slice(-2)

  return {
    year,
    quarter,
    reportCode,
    label: `${shortYear}.${quarter}`,
    revenue: accounts.revenue ?? null,
    operatingProfit: accounts.operatingProfit ?? null,
    netIncome: accounts.netIncome ?? null,
    totalAssets: accounts.totalAssets ?? null,
    totalLiabilities: accounts.totalLiabilities ?? null,
    totalEquity: accounts.totalEquity ?? null,
    isProvisional: true,
  }
}

/**
 * 잠정실적 공시의 항목명을 AccountKey로 매핑합니다
 * @param itemName - 잠정실적 항목명
 * @returns AccountKey 또는 null
 */
function findProvisionalAccountKey(itemName: string): AccountKey | null {
  // 먼저 기존 매핑으로 시도
  const key = findAccountKey(itemName)
  if (key) return key

  // 잠정실적 전용 매핑
  if (itemName.includes('지배기업') && itemName.includes('순이익')) return 'netIncome'

  return null
}
