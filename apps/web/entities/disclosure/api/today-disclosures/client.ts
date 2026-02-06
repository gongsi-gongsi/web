'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type {
  Market,
  TodayDisclosuresResponse,
  PaginatedDisclosuresResponse,
} from '../../model/types'

/**
 * [클라이언트 전용] API Route를 통해 오늘의 공시 목록을 조회합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex | etc)
 * @param limit - 조회할 최대 건수 (선택적)
 * @returns 공시 목록과 메타데이터
 * @throws {Error} API 호출 실패 시
 */
export async function getTodayDisclosures(
  market: Market = 'all',
  limit?: number
): Promise<TodayDisclosuresResponse> {
  const params = new URLSearchParams({ market })
  if (limit !== undefined) {
    params.append('limit', String(limit))
  }
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/today?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch today disclosures')
  }

  return response.json()
}

/**
 * [클라이언트 전용] API Route를 통해 오늘의 공시 목록을 페이지네이션하여 조회합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex | etc)
 * @param pageNo - 페이지 번호 (1부터 시작)
 * @param pageCount - 페이지당 건수
 * @returns 페이지네이션 메타데이터가 포함된 공시 목록
 * @throws {Error} API 호출 실패 시
 */
export async function getTodayDisclosuresPaginated(
  market: Market = 'all',
  pageNo: number = 1,
  pageCount: number = 20
): Promise<PaginatedDisclosuresResponse> {
  const params = new URLSearchParams({
    market,
    page_no: String(pageNo),
    page_count: String(pageCount),
  })
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/today?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch today disclosures')
  }

  return response.json()
}
