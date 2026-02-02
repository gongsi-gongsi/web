import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { searchDisclosures } from '../api/search-disclosures'
import type { SearchDisclosuresParams } from './types'

const PAGE_SIZE = 100

/**
 * 공시 검색 결과를 무한 스크롤로 페이지네이션하여 조회합니다
 * @param params - 검색 파라미터 (pageNo, pageCount 제외)
 * @returns Suspense 기반 무한 쿼리 결과
 */
export function useSearchDisclosures(
  params: Omit<SearchDisclosuresParams, 'pageNo' | 'pageCount'>
) {
  return useSuspenseInfiniteQuery({
    ...queries.disclosures.search(params),
    queryFn: ({ pageParam }) =>
      searchDisclosures({
        ...params,
        pageNo: pageParam as number,
        pageCount: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pageNo < lastPage.totalPage ? lastPage.pageNo + 1 : undefined,
    staleTime: 60000,
  })
}
