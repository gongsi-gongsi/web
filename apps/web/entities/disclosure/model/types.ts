export type Market = 'all' | 'kospi' | 'kosdaq' | 'konex'

export type DisclosureType =
  | 'regular' // 정기공시
  | 'major' // 주요사항보고
  | 'fair' // 공정공시
  | 'other' // 기타

export interface Disclosure {
  id: string // 공시 고유 ID (rcept_no)
  title: string // 공시 제목 (report_nm)
  companyName: string // 회사명 (corp_name)
  stockCode: string // 종목 코드 (stock_code)
  corpCode: string // 회사 고유번호 (corp_code)
  market: Market // 시장 구분 (corp_cls)
  type: DisclosureType // 공시 유형
  receivedAt: string // 접수 시간 (rcept_dt) - JSON 직렬화 후 ISO string
  submitter: string // 제출인 (flr_nm)
  reportUrl: string // 보고서 URL (DART)
}

export interface TodayDisclosuresResponse {
  disclosures: Disclosure[]
  totalCount: number
  lastUpdated: string // JSON 직렬화 후 ISO string
}

// DART API 원본 응답 타입
export interface DartDisclosureItem {
  corp_code: string // 회사 고유번호
  corp_name: string // 회사명
  stock_code: string // 종목코드
  corp_cls: string // 법인구분 (Y: 전체, K: 코스피, N: 코스닥, E: 코넥스)
  report_nm: string // 보고서명
  rcept_no: string // 접수번호
  flr_nm: string // 공시제출인명
  rcept_dt: string // 접수일자 (YYYYMMDD)
  rm: string // 비고
}

export interface DartApiResponse {
  status: string // 응답 상태
  message: string // 응답 메시지
  list: DartDisclosureItem[] // 공시 목록
}
