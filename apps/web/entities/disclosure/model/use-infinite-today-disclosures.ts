import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { getTodayDisclosuresPaginated } from '../api/get-today-disclosures'
import type { Market } from './types'

const PAGE_SIZE = 20

export function useInfiniteTodayDisclosures(market: Market = 'all') {
  return useSuspenseInfiniteQuery({
    ...queries.disclosures.todayInfinite(market),
    queryFn: ({ pageParam }) =>
      getTodayDisclosuresPaginated(market, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pageNo < lastPage.totalPage ? lastPage.pageNo + 1 : undefined,
    staleTime: 30000,
  })
}
