'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { SearchDisclosuresParams, SearchDisclosuresResponse } from '../../model/types'

/**
 * [클라이언트 전용] API Route를 통해 공시를 검색합니다
 * @param params - 검색 파라미터 (키워드, 기간, 시장, 유형, 페이지 정보)
 * @returns 검색 결과와 페이지네이션 메타데이터
 * @throws {Error} API 호출 실패 시
 */
export async function searchDisclosures(
  params: SearchDisclosuresParams
): Promise<SearchDisclosuresResponse> {
  const urlParams = new URLSearchParams({
    q: params.q,
    period: params.period,
    market: params.market,
    type: params.type,
    page_no: String(params.pageNo),
    page_count: String(params.pageCount),
  })

  if (params.bgnDe) {
    urlParams.set('bgn_de', params.bgnDe)
  }
  if (params.endDe) {
    urlParams.set('end_de', params.endDe)
  }

  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/search?${urlParams.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to search disclosures')
  }

  return response.json()
}
