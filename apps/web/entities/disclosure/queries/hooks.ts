'use client'

import { useSuspenseQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getTodayDisclosures, getTodayDisclosuresPaginated } from '../api/today-disclosures/client'
import { searchDisclosures } from '../api/search-disclosures/client'
import { getPopularCompanies } from '../api/popular-companies/client'
import { suggestCompanies } from '../api/suggest-companies/client'
import type { Market, SearchDisclosuresParams } from '../model/types'

/**
 * [클라이언트 전용] 오늘의 공시 목록을 조회합니다
 * 서버에서 prefetch된 데이터가 있으면 즉시 반환되고, 없으면 클라이언트에서 fetch합니다
 * @param market - 시장 구분 (기본값: 'all')
 * @param limit - 조회할 최대 건수 (선택적, 메인 페이지용)
 * @returns Suspense 기반 쿼리 결과
 * @example
 * ```tsx
 * function DisclosureList() {
 *   const { data } = useTodayDisclosures('all')
 *   return <div>{data.disclosures.map(...)}</div>
 * }
 * ```
 */
export function useTodayDisclosures(market: Market = 'all', limit?: number) {
  return useSuspenseQuery({
    queryKey: queries.disclosures.today(market).queryKey,
    queryFn: () => getTodayDisclosures(market, limit),
    staleTime: 60000, // 1분간 fresh 상태 유지
    refetchInterval: 60000, // 1분마다 자동 refetch
    refetchIntervalInBackground: false, // 탭이 백그라운드면 중지
  })
}

/**
 * [클라이언트 전용] 오늘의 공시 목록을 무한 스크롤로 조회합니다
 * @param market - 시장 구분 (기본값: 'all')
 * @param pageCount - 페이지당 건수 (기본값: 20)
 * @returns Infinite Query 결과
 * @example
 * ```tsx
 * function InfiniteDisclosureList() {
 *   const { data, fetchNextPage, hasNextPage } = useInfiniteTodayDisclosures('all')
 *   return (
 *     <div>
 *       {data.pages.map(page => page.disclosures.map(...))}
 *       {hasNextPage && <button onClick={() => fetchNextPage()}>More</button>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useInfiniteTodayDisclosures(market: Market = 'all', pageCount: number = 20) {
  return useSuspenseInfiniteQuery({
    queryKey: queries.disclosures.todayInfinite(market).queryKey,
    queryFn: ({ pageParam = 1 }) => getTodayDisclosuresPaginated(market, pageParam, pageCount),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // 마지막 페이지면 undefined 반환
      if (lastPageParam >= lastPage.totalPage) {
        return undefined
      }
      return lastPageParam + 1
    },
    staleTime: 60000,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  })
}

/**
 * [클라이언트 전용] 공시를 무한 스크롤로 검색합니다
 * @param params - 검색 파라미터 (키워드, 기간, 시장, 유형)
 * @returns Suspense Infinite Query 결과
 * @example
 * ```tsx
 * function SearchResults() {
 *   const { data, fetchNextPage, hasNextPage } = useSearchDisclosures({
 *     q: '삼성전자',
 *     period: '1m',
 *     market: 'all',
 *     type: 'all'
 *   })
 *   return (
 *     <div>
 *       {data.pages.map(page => page.disclosures.map(...))}
 *       {hasNextPage && <button onClick={() => fetchNextPage()}>More</button>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useSearchDisclosures(
  params: Omit<SearchDisclosuresParams, 'pageNo' | 'pageCount'>
) {
  return useSuspenseInfiniteQuery({
    queryKey: queries.disclosures.search(params).queryKey,
    queryFn: ({ pageParam = 1 }) =>
      searchDisclosures({ ...params, pageNo: pageParam, pageCount: 100 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // 마지막 페이지면 undefined 반환
      if (lastPageParam >= lastPage.totalPage) {
        return undefined
      }
      return lastPageParam + 1
    },
    staleTime: 60000,
  })
}

/**
 * [클라이언트 전용] 인기 검색 회사 목록을 조회합니다
 * @param limit - 최대 반환 개수 (기본값: 10)
 * @returns Query 결과
 * @example
 * ```tsx
 * function PopularList() {
 *   const { data, isLoading } = usePopularCompanies(10)
 *   if (isLoading) return <div>Loading...</div>
 *   return <div>{data.map(company => ...)}</div>
 * }
 * ```
 */
export function usePopularCompanies(limit = 10) {
  return useSuspenseQuery({
    queryKey: queries.stocks.popular.queryKey,
    queryFn: () => getPopularCompanies(limit),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

/**
 * [클라이언트 전용] 회사명 자동완성을 조회합니다
 * @param query - 검색할 회사명
 * @param limit - 최대 반환 개수 (기본값: 50)
 * @returns Query 결과
 * @example
 * ```tsx
 * function CompanySearch() {
 *   const [query, setQuery] = useState('')
 *   const { data, isLoading } = useSuggestCompanies(query)
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={e => setQuery(e.target.value)} />
 *       {isLoading ? 'Loading...' : data?.map(company => ...)}
 *     </div>
 *   )
 * }
 * ```
 */
export function useSuggestCompanies(query: string, limit = 50) {
  return useSuspenseQuery({
    queryKey: queries.stocks.suggest(query).queryKey,
    queryFn: () => suggestCompanies(query, limit),
    staleTime: 5 * 60 * 1000, // 5분
  })
}
