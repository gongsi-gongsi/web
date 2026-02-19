'use client'

import { useQuery } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getAiCompanySummary } from '../api/client'

/**
 * [클라이언트 전용] AI 기업 요약을 조회합니다
 * SSR을 건너뛰고 클라이언트 마운트 후에만 fetch합니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns 쿼리 결과 (data, isLoading, isError)
 */
export function useAiCompanySummary(corpCode: string) {
  return useQuery({
    queryKey: queries.ai.companySummary(corpCode).queryKey,
    queryFn: () => getAiCompanySummary(corpCode),
    staleTime: 24 * 60 * 60 * 1000, // 24시간
    retry: false,
  })
}
