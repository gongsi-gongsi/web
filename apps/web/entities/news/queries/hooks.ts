'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'
import { getNewsByCorpName } from '../api/google-news/client'

/**
 * [클라이언트 전용] 기업 관련 뉴스를 조회합니다
 * @param corpName - 기업명
 * @param limit - 최대 조회 건수 (기본값: 10)
 * @returns Suspense 기반 쿼리 결과
 */
export function useCompanyNews(corpName: string, limit?: number) {
  return useSuspenseQuery({
    queryKey: queries.news.company(corpName).queryKey,
    queryFn: () => getNewsByCorpName(corpName, limit),
    staleTime: 5 * 60 * 1000, // 5분
  })
}
