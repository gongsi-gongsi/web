import { fetchAllPages, fetchPublicData, extractItems } from '../client'
import type { KrxStockItem, StockListParams, PublicDataResponse } from '../types'

const ENDPOINT = '/GetKrxListedInfoService/getItemInfo'

// 단일 페이지 조회
export async function getKrxStockList(
  params?: StockListParams
): Promise<PublicDataResponse<KrxStockItem>> {
  return fetchPublicData<KrxStockItem>(ENDPOINT, {
    basDt: params?.basDt,
    mrktCtg: params?.mrktCtg,
    pageNo: params?.pageNo ?? 1,
    numOfRows: params?.numOfRows ?? 100,
  })
}

// 단일 페이지 조회 후 아이템 배열 반환
export async function getKrxStockItems(params?: StockListParams): Promise<KrxStockItem[]> {
  const response = await getKrxStockList(params)
  return extractItems(response)
}

// 전체 종목 조회 (페이지네이션 자동 처리)
export async function getAllKrxStocks(
  params?: Omit<StockListParams, 'pageNo' | 'numOfRows'>
): Promise<KrxStockItem[]> {
  return fetchAllPages<KrxStockItem>(ENDPOINT, {
    basDt: params?.basDt,
    mrktCtg: params?.mrktCtg,
  })
}
