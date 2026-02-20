/** 핵심 수치 항목 */
export interface KeyFigure {
  label: string // "매출액", "영업이익" 등
  value: string // "333.6조원", "+10.8%" 등
  change?: string // 전기 대비 변화
}

/** AI 공시 요약 요청 body */
export interface AiDisclosureSummaryRequest {
  corpCode: string
  corpName: string
  stockCode: string
  market?: string
  reportName: string
  disclosureType?: string
  receivedAt: string
  dartUrl?: string
}

/** AI 공시 요약 응답 */
export interface AiDisclosureSummaryResponse {
  summary: string
  sentiment: 'positive' | 'negative' | 'neutral'
  keyFigures: KeyFigure[]
  analysis: string | null
  createdAt: string
}

/** 요약 완료 공시 ID 목록 응답 */
export interface SummarizedDisclosureIdsResponse {
  rceptNos: string[]
}

/** Gemini 응답 파싱 결과 */
export interface GeminiSummaryResult {
  summary: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentReason: string
  keyFigures: KeyFigure[]
}
