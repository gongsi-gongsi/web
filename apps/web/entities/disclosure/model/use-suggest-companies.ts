'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { suggestCompanies } from '../api/suggest-companies'

/**
 * 회사명 자동완성 결과를 조회합니다
 * useSuspenseQuery를 사용하므로 반드시 Suspense로 감싸야 합니다
 * @param query - 검색할 회사명 (1자 이상)
 * @returns 자동완성 결과
 */
export function useSuggestCompanies(query: string) {
  return useSuspenseQuery({
    ...queries.stocks.suggest(query),
    queryFn: () => suggestCompanies(query),
    staleTime: 60000,
  })
}
