import { Suspense } from 'react'
import Link from 'next/link'
import { HydrationBoundary } from '@tanstack/react-query'

import { MagnifyingGlassIcon, ListIcon } from '@phosphor-icons/react/dist/ssr'

import { MobileHeader } from '@/widgets/header'
import { ServiceBanner } from '@/widgets/service-banner'
import { PopularCompaniesSection } from '@/widgets/popular-companies-section'
import { TodayDisclosures } from '@/widgets/today-disclosures'
import { prefetchTodayDisclosures, prefetchPopularCompanies } from '@/entities/disclosure/server'

export default async function Home() {
  // 병렬로 프리패치 (개별 실패 허용)
  const [todayResult, popularResult] = await Promise.allSettled([
    prefetchTodayDisclosures('all', 6),
    prefetchPopularCompanies(5),
  ])

  // 성공한 결과만 병합
  const dehydratedState = {
    mutations: [],
    queries: [
      ...(todayResult.status === 'fulfilled' ? todayResult.value.queries : []),
      ...(popularResult.status === 'fulfilled' ? popularResult.value.queries : []),
    ],
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="min-h-screen bg-background">
        <MobileHeader
          right={
            <>
              <Link
                href="/disclosures/search"
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                aria-label="검색"
              >
                <MagnifyingGlassIcon className="size-5" />
              </Link>
              <button
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                aria-label="메뉴"
              >
                <ListIcon className="size-5" />
              </button>
            </>
          }
        />

        <ServiceBanner />

        <PopularCompaniesSection />

        <section className="py-6 md:px-4 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <Suspense>
              <TodayDisclosures />
            </Suspense>
          </div>
        </section>
      </main>
    </HydrationBoundary>
  )
}
