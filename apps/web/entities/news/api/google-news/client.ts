'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { NewsResponse } from '../../model/types'

/**
 * [클라이언트 전용] API Route를 통해 기업 뉴스를 조회합니다
 * @param corpName - 기업명
 * @param limit - 최대 조회 건수
 * @returns 뉴스 목록
 * @throws {Error} API 호출 실패 시
 */
export async function getNewsByCorpName(corpName: string, limit?: number): Promise<NewsResponse> {
  const params = new URLSearchParams({ q: corpName })
  if (limit !== undefined) {
    params.append('limit', String(limit))
  }

  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/news?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch company news')
  }

  return response.json()
}

/**
 * [클라이언트 전용] API Route를 통해 주요 시장 뉴스를 조회합니다
 * @param limit - 최대 조회 건수 (기본값: 6)
 * @returns 주요 뉴스 목록
 * @throws {Error} API 호출 실패 시
 */
export async function getMajorMarketNews(limit?: number): Promise<NewsResponse> {
  const params = new URLSearchParams()
  if (limit !== undefined) {
    params.append('limit', String(limit))
  }

  const baseUrl = getBaseUrl()
  const url = params.toString()
    ? `${baseUrl}/api/news/major?${params.toString()}`
    : `${baseUrl}/api/news/major`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch major market news')
  }

  return response.json()
}
