import { fetchPublicData, extractItems } from '../client'
import type { CompanyInfoItem, PublicDataResponse } from '../types'

const ENDPOINT = '/GetCorpBasicInfoService_V2/getCorpOutline_V2'

export interface CompanyInfoParams {
  crno?: string // 법인등록번호
  corpNm?: string // 법인명
  pageNo?: number
  numOfRows?: number
}

// 단일 페이지 조회
export async function getCompanyInfo(
  params?: CompanyInfoParams
): Promise<PublicDataResponse<CompanyInfoItem>> {
  return fetchPublicData<CompanyInfoItem>(ENDPOINT, {
    crno: params?.crno,
    corpNm: params?.corpNm,
    pageNo: params?.pageNo ?? 1,
    numOfRows: params?.numOfRows ?? 100,
  })
}

// 단일 페이지 조회 후 아이템 배열 반환
export async function getCompanyInfoItems(params?: CompanyInfoParams): Promise<CompanyInfoItem[]> {
  const response = await getCompanyInfo(params)
  return extractItems(response)
}

// 법인등록번호로 단일 기업 조회
export async function getCompanyByCrno(crno: string): Promise<CompanyInfoItem | null> {
  if (!crno || crno === '0000000000000') return null

  try {
    const items = await getCompanyInfoItems({ crno, numOfRows: 1 })
    return items[0] ?? null
  } catch {
    return null
  }
}
