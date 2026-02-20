'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type {
  AiDisclosureSummaryRequest,
  AiDisclosureSummaryResponse,
  SummarizedDisclosureIdsResponse,
} from '../model/types'

/**
 * [클라이언트 전용] AI 공시 요약을 생성/조회합니다
 * @param rceptNo - 접수번호
 * @param body - 공시 메타데이터
 * @returns AI 공시 요약 응답
 * @throws {Error} API 호출 실패 시
 */
export async function generateAiDisclosureSummary(
  rceptNo: string,
  body: AiDisclosureSummaryRequest
): Promise<AiDisclosureSummaryResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/${rceptNo}/ai-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'AI 요약 생성에 실패했습니다')
  }

  return response.json()
}

/**
 * [클라이언트 전용] AI 요약이 완료된 공시 rceptNo 목록을 조회합니다
 * @returns 요약 완료된 rceptNo 배열
 */
export async function getSummarizedDisclosureIds(): Promise<SummarizedDisclosureIdsResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/summarized-ids`)

  if (!response.ok) {
    return { rceptNos: [] }
  }

  return response.json()
}
