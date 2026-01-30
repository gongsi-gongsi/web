import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTodayDisclosuresPaginated } from '@/entities/disclosure'
import { getQueryClient } from '@/shared/lib/get-query-client'
import { queries } from '@/shared/lib/query-keys'
import { DisclosureListPage } from '@/widgets/disclosure-list-page'

export default async function DisclosuresPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>
}) {
  const params = await searchParams
  const market = (params.market as 'all' | 'kospi' | 'kosdaq' | 'konex') || 'all'

  // 서버에서 데이터 prefetch
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    ...queries.disclosures.todayInfinite(market),
    queryFn: () => getTodayDisclosuresPaginated(market, 1, 20),
    initialPageParam: 1,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen bg-background">
        <DisclosureListPage />
      </main>
    </HydrationBoundary>
  )
}
