'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { AiCompanySummary } from '../model/types'

/**
 * [클라이언트 전용] API Route를 통해 AI 기업 요약을 조회합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns AI 기업 요약
 * @throws {Error} API 호출 실패 시
 */
export async function getAiCompanySummary(corpCode: string): Promise<AiCompanySummary> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/companies/${corpCode}/ai-summary`)

  if (!response.ok) {
    throw new Error('Failed to fetch AI company summary')
  }

  return response.json()
}
