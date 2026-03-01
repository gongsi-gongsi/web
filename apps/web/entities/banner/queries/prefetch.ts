import { QueryClient, dehydrate } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getActiveBanners } from '../api/client'

/**
 * [서버 컴포넌트용] 활성 배너 데이터를 prefetch합니다
 * @returns Dehydrated state (HydrationBoundary에 전달)
 */
export async function prefetchActiveBanners() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queries.banners.active.queryKey,
    queryFn: getActiveBanners,
    staleTime: 60 * 1000,
  })

  return dehydrate(queryClient)
}
