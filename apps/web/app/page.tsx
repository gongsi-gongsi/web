import { Suspense } from 'react'
import Link from 'next/link'
import { HydrationBoundary } from '@tanstack/react-query'

import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'

import { MobileHeader } from '@/widgets/header'
import { BannerSearch } from '@/widgets/service-banner'
import { BannerSlider } from '@/widgets/banner-slider'
import {
  PopularCompaniesSection,
  PopularCompaniesSectionSkeleton,
} from '@/widgets/popular-companies-section'
import { MajorNewsSection, MajorNewsSectionSkeleton } from '@/widgets/major-news-section'
import { TodayDisclosures } from '@/widgets/today-disclosures'
import { prefetchTodayDisclosures, prefetchPopularCompanies } from '@/entities/disclosure/server'
import { prefetchMajorMarketNews } from '@/entities/news/server'

// 빌드 시 프리렌더링 방지 (DB 연결 필요)
export const dynamic = 'force-dynamic'

async function PopularCompaniesWithPrefetch() {
  const dehydratedState = await prefetchPopularCompanies(5)
  return (
    <HydrationBoundary state={dehydratedState}>
      <PopularCompaniesSection />
    </HydrationBoundary>
  )
}

async function MajorNewsWithPrefetch() {
  const dehydratedState = await prefetchMajorMarketNews(6)
  return (
    <HydrationBoundary state={dehydratedState}>
      <MajorNewsSection />
    </HydrationBoundary>
  )
}

async function TodayDisclosuresWithPrefetch() {
  const dehydratedState = await prefetchTodayDisclosures('all', 6)
  return (
    <HydrationBoundary state={dehydratedState}>
      <TodayDisclosures />
    </HydrationBoundary>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      <MobileHeader
        right={
          <Link
            href="/search"
            className="flex size-9 items-center justify-end rounded-md text-muted-foreground hover:text-foreground"
            aria-label="검색"
          >
            <MagnifyingGlassIcon className="size-5" />
          </Link>
        }
      />

      {/* 검색바 - PC only */}
      <section className="hidden px-4 pt-3 md:block lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <BannerSearch />
        </div>
      </section>

      {/* 이미지 배너 슬라이더 */}
      <section className="mb-6 px-4 pt-3 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <BannerSlider />
        </div>
      </section>

      <Suspense fallback={<PopularCompaniesSectionSkeleton />}>
        <PopularCompaniesWithPrefetch />
      </Suspense>

      <Suspense fallback={<MajorNewsSectionSkeleton />}>
        <MajorNewsWithPrefetch />
      </Suspense>

      <section className="py-6 md:px-4 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Suspense>
            <TodayDisclosuresWithPrefetch />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
