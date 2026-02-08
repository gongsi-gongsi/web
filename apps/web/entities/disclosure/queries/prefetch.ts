import { QueryClient, dehydrate } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getTodayDisclosuresFromDart } from '../api/today-disclosures/server'
import { getPopularCompaniesFromDB } from '../api/popular-companies/server'
import type { Market } from '../model/types'

/**
 * [서버 컴포넌트용] 오늘의 공시 데이터를 prefetch합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex | etc)
 * @param limit - 조회할 최대 건수 (기본값: 100)
 * @returns Dehydrated state (HydrationBoundary에 전달)
 * @example
 * ```tsx
 * // app/disclosures/page.tsx
 * export default async function Page() {
 *   const dehydratedState = await prefetchTodayDisclosures('all')
 *   return (
 *     <HydrationBoundary state={dehydratedState}>
 *       <DisclosureList />
 *     </HydrationBoundary>
 *   )
 * }
 * ```
 */
export async function prefetchTodayDisclosures(market: Market = 'all', limit: number = 100) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
      },
    },
  })

  await queryClient.prefetchQuery({
    queryKey: queries.disclosures.today(market).queryKey,
    queryFn: () => getTodayDisclosuresFromDart(market, limit),
    staleTime: 60000, // 1분
  })

  return dehydrate(queryClient)
}

/**
 * [서버 컴포넌트용] 인기 회사 데이터를 prefetch합니다
 * @param limit - 조회할 최대 건수 (기본값: 5)
 * @returns Dehydrated state (HydrationBoundary에 전달)
 */
export async function prefetchPopularCompanies(limit: number = 5) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분
      },
    },
  })

  await queryClient.prefetchQuery({
    queryKey: queries.stocks.popular.queryKey,
    queryFn: () => getPopularCompaniesFromDB(limit),
    staleTime: 5 * 60 * 1000, // 5분
  })

  return dehydrate(queryClient)
}
