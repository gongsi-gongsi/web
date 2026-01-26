import { fetchAllPages, fetchPublicData, extractItems } from '../client'
import type { StockPriceItem, StockPriceParams, PublicDataResponse } from '../types'

const ENDPOINT = '/GetStockSecuritiesInfoService/getStockPriceInfo'

// 단일 페이지 조회
export async function getStockPrices(
  params?: StockPriceParams
): Promise<PublicDataResponse<StockPriceItem>> {
  return fetchPublicData<StockPriceItem>(ENDPOINT, {
    basDt: params?.basDt,
    srtnCd: params?.srtnCd,
    mrktCtg: params?.mrktCtg,
    pageNo: params?.pageNo ?? 1,
    numOfRows: params?.numOfRows ?? 100,
  })
}

// 단일 페이지 조회 후 아이템 배열 반환
export async function getStockPriceItems(params?: StockPriceParams): Promise<StockPriceItem[]> {
  const response = await getStockPrices(params)
  return extractItems(response)
}

// 전체 시세 조회 (페이지네이션 자동 처리)
export async function getAllStockPrices(
  params?: Omit<StockPriceParams, 'pageNo' | 'numOfRows'>
): Promise<StockPriceItem[]> {
  return fetchAllPages<StockPriceItem>(ENDPOINT, {
    basDt: params?.basDt,
    srtnCd: params?.srtnCd,
    mrktCtg: params?.mrktCtg,
  })
}
