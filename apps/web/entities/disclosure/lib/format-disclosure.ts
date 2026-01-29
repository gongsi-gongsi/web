import type { DartDisclosureItem, Disclosure, Market, DisclosureType } from '../model/types'

function getMarketFromCorpCls(corpCls: string): Market {
  switch (corpCls) {
    case 'K':
      return 'kospi'
    case 'N':
      return 'kosdaq'
    case 'E':
      return 'konex'
    case 'Y':
    default:
      // 'Y'는 요청 파라미터로만 사용되고, 개별 공시는 K/N/E 중 하나
      // 만약 'Y'가 온다면 kospi로 기본 설정
      return 'kospi'
  }
}

function getDisclosureType(reportName: string): DisclosureType {
  const name = reportName.toLowerCase()

  // 정기공시: 분기보고서, 반기보고서, 사업보고서
  if (name.includes('분기보고서') || name.includes('반기보고서') || name.includes('사업보고서')) {
    return 'regular'
  }

  // 주요사항보고: 주요사항보고서, 합병, 분할, 자사주, 유상증자 등
  if (
    name.includes('주요사항보고') ||
    name.includes('합병') ||
    name.includes('분할') ||
    name.includes('자사주') ||
    name.includes('유상증자') ||
    name.includes('무상증자') ||
    name.includes('주식매수선택권')
  ) {
    return 'major'
  }

  // 공정공시: 공정공시
  if (name.includes('공정공시')) {
    return 'fair'
  }

  return 'other'
}

function parseDateString(dateStr: string): Date {
  // YYYYMMDD 형식을 Date로 변환
  const year = parseInt(dateStr.substring(0, 4), 10)
  const month = parseInt(dateStr.substring(4, 6), 10) - 1
  const day = parseInt(dateStr.substring(6, 8), 10)
  return new Date(year, month, day)
}

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
