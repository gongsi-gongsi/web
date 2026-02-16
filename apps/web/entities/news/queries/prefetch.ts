import { QueryClient, dehydrate } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'
import { getMajorMarketNews } from '../api/google-news/server'

const STALE_TIME_5_MIN = 5 * 60 * 1000

/**
 * [서버 컴포넌트용] 주요 시장 뉴스 데이터를 prefetch합니다
 * @param limit - 조회할 최대 건수 (기본값: 6)
 * @returns Dehydrated state (HydrationBoundary에 전달)
 * @example
 * ```tsx
 * // app/page.tsx
 * export default async function Page() {
 *   const dehydratedState = await prefetchMajorMarketNews(6)
 *   return (
 *     <HydrationBoundary state={dehydratedState}>
 *       <MajorNewsSection />
 *     </HydrationBoundary>
 *   )
 * }
 * ```
 */
export async function prefetchMajorMarketNews(limit: number = 6) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queries.news.market.queryKey,
    queryFn: () => getMajorMarketNews(limit),
    staleTime: STALE_TIME_5_MIN,
  })

  return dehydrate(queryClient)
}
