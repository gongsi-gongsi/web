import { Suspense } from 'react'
import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchTodayDisclosures, type Market } from '@/entities/disclosure/server'
import { ErrorBoundaryWithFallback } from '@/shared/lib/error-boundary'
import { DisclosureList, DisclosureListSkeleton } from '@/widgets/disclosure-list-page'

interface DisclosuresPageProps {
  searchParams: Promise<{ market?: string }>
}

export default async function DisclosuresPage({ searchParams }: DisclosuresPageProps) {
  const params = await searchParams
  const market = (params.market as Market) || 'all'

  // 서버에서 데이터 prefetch
  const dehydratedState = await prefetchTodayDisclosures(market)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">공시 목록</h1>
          <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <HydrationBoundary state={dehydratedState}>
          <ErrorBoundaryWithFallback>
            <Suspense fallback={<DisclosureListSkeleton />}>
              <DisclosureList />
            </Suspense>
          </ErrorBoundaryWithFallback>
        </HydrationBoundary>
      </div>
    </main>
  )
}
