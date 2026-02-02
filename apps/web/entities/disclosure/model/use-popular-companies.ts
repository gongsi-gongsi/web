'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { getPopularCompanies } from '../api/get-popular-companies'

/**
 * 인기 검색 회사 목록을 조회합니다
 * useSuspenseQuery를 사용하므로 반드시 Suspense로 감싸야 합니다
 * @returns 인기 검색 회사 목록
 */
export function usePopularCompanies() {
  return useSuspenseQuery({
    queryKey: queries.stocks.popular.queryKey,
    queryFn: () => getPopularCompanies(),
    staleTime: 5 * 60 * 1000,
  })
}
