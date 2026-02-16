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
