'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { generateAiDisclosureSummary, getSummarizedDisclosureIds } from '../api/client'
import type { AiDisclosureSummaryRequest } from '../model/types'

/**
 * AI 요약이 완료된 공시 rceptNo 목록을 조회합니다
 * 공시 목록에서 버튼 상태(완료 뱃지) 결정에 사용합니다
 * @returns rceptNos 배열을 포함한 쿼리 결과
 */
export function useSummarizedDisclosureIds() {
  return useQuery({
    queryKey: queries.ai.disclosureSummaryIds.queryKey,
    queryFn: getSummarizedDisclosureIds,
    staleTime: 5 * 60 * 1000, // 5분
    select: data => data.rceptNos,
  })
}

/**
 * AI 공시 요약을 생성하는 mutation 훅
 * 성공 시 요약 ID 목록 캐시를 무효화합니다
 * @returns useMutation 결과
 */
export function useGenerateDisclosureSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rceptNo, body }: { rceptNo: string; body: AiDisclosureSummaryRequest }) =>
      generateAiDisclosureSummary(rceptNo, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.ai.disclosureSummaryIds.queryKey,
      })
    },
  })
}
