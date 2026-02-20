import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTodayDisclosuresFromDartPaginated, type Market } from '@/entities/disclosure/server'
import { getQueryClient } from '@/shared/lib/get-query-client'
import { queries } from '@/shared/lib/query-keys'
import { DisclosureListPage } from '@/widgets/disclosure-list-page'

export const metadata: Metadata = {
  title: '오늘의 공시',
  description: '오늘 발표된 기업 공시를 실시간으로 확인하세요',
}

export default async function DisclosuresPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>
}) {
  const params = await searchParams
  const market = (params.market as Market) || 'all'

  // 서버에서 데이터 prefetch (서버 전용 API 사용)
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: queries.disclosures.todayInfinite(market).queryKey,
    queryFn: () => getTodayDisclosuresFromDartPaginated(market, 1, 20),
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
