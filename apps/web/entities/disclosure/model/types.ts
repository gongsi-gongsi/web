export type Market = 'all' | 'kospi' | 'kosdaq' | 'konex' | 'etc'

export type DisclosureType =
  | 'A' // 정기공시
  | 'B' // 주요사항보고
  | 'C' // 발행공시
  | 'D' // 지분공시
  | 'E' // 기타공시
  | 'F' // 외부감사관련
  | 'G' // 펀드공시
  | 'H' // 자산유동화
  | 'I' // 거래소공시
  | 'J' // 공정위공시

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
  corp_cls: string // 법인구분 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타)
  report_nm: string // 보고서명
  rcept_no: string // 접수번호
  flr_nm: string // 공시제출인명
  rcept_dt: string // 접수일자 (YYYYMMDD)
  rm: string // 비고
  pblntf_ty: string // 공시유형 (A~J)
}

export interface DartApiResponse {
  status: string // 응답 상태
  message: string // 응답 메시지
  page_no: number // 페이지 번호
  page_count: number // 페이지당 건수
  total_count: number // 총 건수
  total_page: number // 총 페이지 수
  list: DartDisclosureItem[] // 공시 목록
}

export interface PaginatedDisclosuresResponse {
  disclosures: Disclosure[]
  totalCount: number
  totalPage: number
  pageNo: number
  pageCount: number
  lastUpdated: string
}

export type SearchPeriod = 'today' | '1w' | '1m' | '3m' | 'custom'

export interface SearchDisclosuresParams {
  q: string
  period: SearchPeriod
  bgnDe?: string // YYYYMMDD, period === 'custom'일 때 필수
  endDe?: string // YYYYMMDD, period === 'custom'일 때 필수
  market: Market
  type: DisclosureType | 'all'
  pageNo: number
  pageCount: number
}

export interface SearchDisclosuresResponse extends PaginatedDisclosuresResponse {
  query: string
}
