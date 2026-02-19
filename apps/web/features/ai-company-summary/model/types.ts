/** AI 기업 요약 응답 */
export interface AiCompanySummary {
  /** 통합 요약 (재무 + 이슈 + 전망) */
  summary: string
  /** 생성 시각 (ISO 8601) */
  generatedAt: string
}
