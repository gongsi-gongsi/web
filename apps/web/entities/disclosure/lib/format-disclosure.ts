import type { DartDisclosureItem, Disclosure, Market, DisclosureType } from '../model/types'

/**
 * DART API의 corp_cls 코드를 시장 구분으로 변환합니다
 * @param corpCls - 법인구분 코드 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타)
 * @returns 시장 구분 (kospi | kosdaq | konex | etc)
 */
function getMarketFromCorpCls(corpCls: string): Market {
  switch (corpCls) {
    case 'Y':
      return 'kospi'
    case 'K':
      return 'kosdaq'
    case 'N':
      return 'konex'
    case 'E':
    default:
      return 'etc'
  }
}

/**
 * 공시 제목을 분석하여 공시 유형을 추론합니다
 * @param reportName - 공시 보고서명
 * @returns 공시 유형 코드 (A~J)
 * @example
 * getDisclosureType('사업보고서') // 'A'
 * getDisclosureType('주요사항보고서') // 'B'
 */
function getDisclosureType(reportName: string): DisclosureType {
  const name = reportName.toLowerCase()

  // A: 정기공시 - 사업보고서, 반기보고서, 분기보고서
  if (name.includes('사업보고서') || name.includes('반기보고서') || name.includes('분기보고서')) {
    return 'A'
  }

  // B: 주요사항보고
  if (name.includes('주요사항보고')) {
    return 'B'
  }

  // C: 발행공시 - 증권신고서, 투자설명서, 채무증권
  if (name.includes('증권신고서') || name.includes('투자설명서') || name.includes('채무증권')) {
    return 'C'
  }

  // D: 지분공시 - 주식등의대량보유상황보고서
  if (name.includes('주식등의대량보유') || name.includes('대량보유상황보고')) {
    return 'D'
  }

  // F: 외부감사관련 - 감사보고서
  if (name.includes('감사보고서')) {
    return 'F'
  }

  // G: 펀드공시 - 자산운용보고서
  if (name.includes('자산운용보고서')) {
    return 'G'
  }

  // H: 자산유동화
  if (name.includes('자산유동화')) {
    return 'H'
  }

  // I: 거래소공시 - 조회공시
  if (name.includes('조회공시')) {
    return 'I'
  }

  // J: 공정위공시 - 공정거래
  if (name.includes('공정거래')) {
    return 'J'
  }

  // E: 기타공시 (기본값)
  return 'E'
}

/**
 * YYYYMMDD 형식의 날짜 문자열을 Date 객체로 변환합니다
 * @param dateStr - YYYYMMDD 형식의 날짜 문자열
 * @returns Date 객체
 * @example
 * parseDateString('20240130') // new Date(2024, 0, 30)
 */
function parseDateString(dateStr: string): Date {
  // YYYYMMDD 형식을 Date로 변환
  const year = parseInt(dateStr.substring(0, 4), 10)
  const month = parseInt(dateStr.substring(4, 6), 10) - 1
  const day = parseInt(dateStr.substring(6, 8), 10)
  return new Date(year, month, day)
}

/**
 * DART API 응답 데이터를 애플리케이션 공시 모델로 변환합니다
 * @param item - DART API 공시 데이터
 * @returns 변환된 공시 객체
 */
export function formatDisclosure(item: DartDisclosureItem): Disclosure {
  const market = getMarketFromCorpCls(item.corp_cls)
  const type = getDisclosureType(item.report_nm)
  const receivedAt = parseDateString(item.rcept_dt).toISOString()
  const reportUrl = `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${item.rcept_no}`

  return {
    id: item.rcept_no,
    title: item.report_nm,
    companyName: item.corp_name,
    stockCode: item.stock_code || '-',
    corpCode: item.corp_code,
    market,
    type,
    receivedAt,
    submitter: item.flr_nm,
    reportUrl,
  }
}
