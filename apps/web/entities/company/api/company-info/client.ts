'use client'

import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { CompanyInfo } from '../../model/types'

/**
 * [클라이언트 전용] API Route를 통해 기업 정보를 조회합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns 기업 정보
 * @throws {Error} API 호출 실패 시
 */
export async function getCompanyInfo(corpCode: string): Promise<CompanyInfo | null> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/companies/${corpCode}`)

  if (!response.ok) {
    throw new Error('Failed to fetch company info')
  }

  return response.json()
}
