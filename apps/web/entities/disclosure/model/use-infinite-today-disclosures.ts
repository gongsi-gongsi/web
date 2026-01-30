import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { getTodayDisclosuresPaginated } from '../api/get-today-disclosures'
import type { Market } from './types'

const PAGE_SIZE = 20

/**
 * 오늘의 공시 목록을 무한 스크롤로 페이지네이션하여 조회합니다
 * @param market - 시장 구분 (기본값: 'all')
 * @returns Suspense 기반 무한 쿼리 결과
 */
export function useInfiniteTodayDisclosures(market: Market = 'all') {
  return useSuspenseInfiniteQuery({
    ...queries.disclosures.todayInfinite(market),
    queryFn: ({ pageParam }) =>
      getTodayDisclosuresPaginated(market, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pageNo < lastPage.totalPage ? lastPage.pageNo + 1 : undefined,
    staleTime: 60000,
  })
}
