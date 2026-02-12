import { getDartApiKey } from '@/shared/lib/dart/utils'
import type { DartCompanyResponse, CompanyInfo } from '../../model'

/**
 * DART API에서 기업개황을 조회합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns 기업 정보
 */
export async function getCompanyInfo(corpCode: string): Promise<CompanyInfo | null> {
  const dartUrl = new URL('https://opendart.fss.or.kr/api/company.json')
  dartUrl.searchParams.append('crtfc_key', getDartApiKey())
  dartUrl.searchParams.append('corp_code', corpCode)

  const response = await fetch(dartUrl.toString(), {
    next: {
      revalidate: 86400 * 7, // 7일 캐시 (기업 정보는 자주 변경되지 않음)
      tags: ['company', corpCode],
    },
  })

  if (!response.ok) {
    throw new Error(`DART API error: ${response.status}`)
  }

  const data: DartCompanyResponse = await response.json()

  if (data.status !== '000') {
    return null
  }

  return {
    corpCode: data.corp_code,
    corpName: data.corp_name,
    stockCode: data.stock_code,
    stockName: data.stock_name,
    ceoName: data.ceo_nm,
    corpCls: data.corp_cls,
    address: data.adres,
    homepage: data.hm_url,
    industryCode: data.induty_code,
    establishedDate: data.est_dt,
  }
}
