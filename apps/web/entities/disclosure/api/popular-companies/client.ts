'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { PopularCompany, PopularCompaniesResponse } from '../../model/types'

/**
 * [클라이언트 전용] API Route를 통해 인기 검색 회사 목록을 조회합니다
 * @param limit - 최대 반환 개수 (기본값: 10)
 * @returns 인기 검색 회사 목록
 */
export async function getPopularCompanies(limit = 10): Promise<PopularCompany[]> {
  const baseUrl = getBaseUrl()
  const params = new URLSearchParams({ limit: String(limit) })
  const response = await fetch(`${baseUrl}/api/stocks/popular?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch popular companies')
  }

  const data: PopularCompaniesResponse = await response.json()
  return data.companies
}
