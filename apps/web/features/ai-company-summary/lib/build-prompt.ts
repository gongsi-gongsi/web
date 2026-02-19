import type { FinancialData } from '@/entities/company'

/**
 * 숫자를 억 원 단위로 포맷팅합니다
 * @param value - 원 단위 숫자
 * @returns 억 원 단위 문자열 (예: "1,234억")
 */
function formatToEok(value: number | null): string {
  if (value === null) return '데이터 없음'
  const eok = Math.round(value / 100_000_000)
  return `${eok.toLocaleString('ko-KR')}억`
}

/**
 * 성장률을 계산합니다
 * @param current - 현재 값
 * @param previous - 이전 값
 * @returns 성장률 문자열 (예: "+12.3%")
 */
function calculateGrowthRate(current: number | null, previous: number | null): string {
  if (current === null || previous === null || previous === 0) return 'N/A'
  const rate = ((current - previous) / Math.abs(previous)) * 100
  const sign = rate >= 0 ? '+' : ''
  return `${sign}${rate.toFixed(1)}%`
}

/**
 * 재무 데이터를 프롬프트용 텍스트로 변환합니다
 * @param financials - 재무 데이터 배열
 * @returns 재무 요약 텍스트
 */
function formatFinancialContext(financials: FinancialData[]): string {
  if (financials.length === 0) return '재무 데이터 없음'

  const lines = financials.map((f, idx) => {
    const prev = financials[idx + 1]
    const revenueGrowth = prev ? calculateGrowthRate(f.revenue, prev.revenue) : ''
    const opGrowth = prev ? calculateGrowthRate(f.operatingProfit, prev.operatingProfit) : ''

    return [
      `[${f.label}${f.isProvisional ? ' (잠정)' : ''}]`,
      `매출: ${formatToEok(f.revenue)}${revenueGrowth ? ` (전기대비 ${revenueGrowth})` : ''}`,
      `영업이익: ${formatToEok(f.operatingProfit)}${opGrowth ? ` (전기대비 ${opGrowth})` : ''}`,
      `순이익: ${formatToEok(f.netIncome)}`,
    ].join(' / ')
  })

  return lines.join('\n')
}

/**
 * AI 기업 요약 생성을 위한 프롬프트를 빌드합니다
 * @param companyName - 기업명
 * @param financialData - 분기별 재무 데이터
 * @param newsTitles - 최근 뉴스 제목 목록
 * @returns Gemini API에 전달할 프롬프트 문자열
 */
export function buildCompanySummaryPrompt(
  companyName: string,
  financialData: FinancialData[],
  newsTitles: string[]
): string {
  const financialContext = formatFinancialContext(financialData)
  const newsContext =
    newsTitles.length > 0 ? newsTitles.map((t, i) => `${i + 1}. ${t}`).join('\n') : '관련 뉴스 없음'

  return `당신은 한국 주식 시장 전문 애널리스트입니다.
아래 재무 데이터와 최근 뉴스를 분석하여 "${companyName}"에 대한 간결한 요약을 작성해주세요.

## 재무 데이터 (최근 분기)
${financialContext}

## 최근 뉴스 제목
${newsContext}

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
재무 현황, 주요 이슈, 전망을 하나의 문단으로 자연스럽게 통합하세요.
3~4문장, 한국어로 작성하세요.

{
  "summary": "재무 현황 + 주요 이슈 + 전망을 통합한 간결한 요약"
}`
}
