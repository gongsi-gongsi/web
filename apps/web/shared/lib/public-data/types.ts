// 공통 API 응답 구조
export interface PublicDataResponse<T> {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      numOfRows: number
      pageNo: number
      totalCount: number
      items: {
        item: T | T[]
      }
    }
  }
}

// KRX 상장종목정보 응답
export interface KrxStockItem {
  basDt: string // 기준일자 (YYYYMMDD)
  srtnCd: string // 단축코드 (6자리)
  isinCd: string // ISIN코드 (12자리)
  mrktCtg: string // 시장구분 (KOSPI/KOSDAQ/KONEX)
  itmsNm: string // 종목명
  crno: string // 법인등록번호
  corpNm: string // 법인명
}

// 주식시세정보 응답
export interface StockPriceItem {
  basDt: string // 기준일자
  srtnCd: string // 단축코드
  isinCd: string // ISIN코드
  itmsNm: string // 종목명
  mrktCtg: string // 시장구분
  clpr: string // 종가
  mkp: string // 시가
  hipr: string // 고가
  lopr: string // 저가
  trqu: string // 거래량
  trPrc: string // 거래대금
  lstgStCnt: string // 상장주식수
  mrktTotAmt: string // 시가총액
  vs: string // 대비
  fltRt: string // 등락률
}

// 기업기본정보 응답
export interface CompanyInfoItem {
  crno: string // 법인등록번호
  corpNm: string // 법인명
  corpEnsnNm?: string // 법인영문명
  enpRprFnm?: string // 대표자명
  enpBsadr?: string // 기업주소
  enpHmpgUrl?: string // 홈페이지URL
  enpTlno?: string // 전화번호
  sicNm?: string // 표준산업분류명 (업종)
  enpMainBizNm?: string // 주요사업명
  enpEstbDt?: string // 설립일자
  enpEmpeCnt?: string // 종업원수
}

// API 요청 파라미터
export interface StockListParams {
  basDt?: string // 기준일자 (YYYYMMDD)
  mrktCtg?: 'KOSPI' | 'KOSDAQ' | 'KONEX'
  pageNo?: number
  numOfRows?: number
}

export interface StockPriceParams {
  basDt?: string // 기준일자 (YYYYMMDD)
  srtnCd?: string // 단축코드
  mrktCtg?: 'KOSPI' | 'KOSDAQ'
  pageNo?: number
  numOfRows?: number
}
