/**
 * 재무제표 관련 타입 정의
 */

// DART API 보고서 코드
export type ReportCode = '11011' | '11012' | '11013' | '11014'

// 조회 모드
export type FinancialViewMode = 'yearly' | 'quarterly'

// 분기 구분
export type Quarter = '1Q' | '2Q' | '3Q' | '4Q'

// DART API 응답 - 단일회사 주요계정
export interface DartFinancialItem {
  rcept_no: string
  bsns_year: string
  corp_code: string
  stock_code: string
  reprt_code: string
  account_nm: string
  fs_div: 'CFS' | 'OFS'
  fs_nm: string
  sj_div: 'BS' | 'IS' | 'CF' | 'SCE'
  sj_nm: string
  thstrm_nm: string
  thstrm_amount: string
  frmtrm_nm: string
  frmtrm_amount: string
  bfefrmtrm_nm: string
  bfefrmtrm_amount: string
  ord: string
}

export interface DartFinancialResponse {
  status: string
  message: string
  list?: DartFinancialItem[]
}

// 앱 내부 타입 - 재무 데이터
export interface FinancialData {
  year: number
  quarter?: Quarter
  reportCode: ReportCode
  label: string // '2024' 또는 '24.3Q'
  revenue: number | null
  operatingProfit: number | null
  netIncome: number | null
  totalAssets: number | null
  totalLiabilities: number | null
  totalEquity: number | null
  isProvisional?: boolean // 잠정실적 여부
}

// API 응답 타입
export interface FinancialStatementsResponse {
  corpCode: string
  mode: FinancialViewMode
  data: FinancialData[]
}

// 보고서 코드 정보
export const REPORT_CODE_INFO: Record<ReportCode, { name: string; quarter: Quarter }> = {
  '11013': { name: '1분기보고서', quarter: '1Q' },
  '11012': { name: '반기보고서', quarter: '2Q' },
  '11014': { name: '3분기보고서', quarter: '3Q' },
  '11011': { name: '사업보고서', quarter: '4Q' },
}

// DART API 응답 - 기업개황
export interface DartCompanyResponse {
  status: string
  message: string
  corp_code: string
  corp_name: string
  corp_name_eng: string
  stock_name: string
  stock_code: string
  ceo_nm: string
  corp_cls: 'Y' | 'K' | 'N' | 'E' // 유가, 코스닥, 코넥스, 기타
  jurir_no: string
  bizr_no: string
  adres: string
  hm_url: string
  ir_url: string
  phn_no: string
  fax_no: string
  induty_code: string
  est_dt: string
  acc_mt: string
}

// 앱 내부 타입 - 기업 정보
export interface CompanyInfo {
  corpCode: string
  corpName: string
  stockCode: string
  stockName: string
  ceoName: string
  corpCls: 'Y' | 'K' | 'N' | 'E'
  address: string
  homepage: string
  industryCode: string
  establishedDate: string
}
