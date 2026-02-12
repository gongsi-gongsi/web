'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { FinancialViewMode, FinancialStatementsResponse } from '../../model'

/**
 * [클라이언트 전용] API Route를 통해 재무제표를 조회합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @param mode - 조회 모드 (yearly | quarterly)
 * @returns 재무 데이터
 * @throws {Error} API 호출 실패 시
 */
export async function getFinancials(
  corpCode: string,
  mode: FinancialViewMode = 'yearly'
): Promise<FinancialStatementsResponse> {
  const baseUrl = getBaseUrl()
  const params = new URLSearchParams({ mode })
  const response = await fetch(
    `${baseUrl}/api/companies/${corpCode}/financials?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch financials')
  }

  return response.json()
}
