// DART API 응답 타입

/**
 * 기업 고유번호 정보
 */
export interface CorpCode {
  corpCode: string // 고유번호 (8자리)
  corpName: string // 기업명
  stockCode?: string // 종목코드 (6자리, 상장사만 존재)
  modifyDate: string // 최종변경일자 (YYYYMMDD)
}

/**
 * 고유번호 조회 API 응답 (XML 파싱 결과)
 */
export interface CorpCodeResponse {
  result: {
    list: Array<{
      corp_code: string[]
      corp_name: string[]
      stock_code: string[]
      modify_date: string[]
    }>
  }
}

/**
 * DART API 에러 응답
 */
export interface DartErrorResponse {
  status: string
  message: string
}
