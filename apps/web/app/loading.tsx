import Link from 'next/link'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'

import { MobileHeader } from '@/widgets/header'
import { PopularCompaniesSectionSkeleton } from '@/widgets/popular-companies-section'
import { MajorNewsSectionSkeleton } from '@/widgets/major-news-section'
import { DisclosureGridSkeleton, DisclosureSkeleton } from '@/widgets/today-disclosures'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0" aria-busy="true">
      <MobileHeader
        right={
          <Link
            href="/search"
            className="flex size-9 items-center justify-end rounded-md text-muted-foreground"
            aria-label="검색"
          >
            <MagnifyingGlassIcon className="size-5" />
          </Link>
        }
      />

      {/* 검색바 skeleton - PC only */}
      <section className="hidden px-4 pt-3 md:block lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="h-12 animate-pulse rounded-xl bg-muted" />
        </div>
      </section>

      {/* 배너 슬라이더 skeleton */}
      <section className="mb-6 px-4 pt-3 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="h-[200px] animate-pulse rounded-2xl bg-muted md:aspect-[1280/250] md:h-auto" />
        </div>
      </section>

      {/* 인기 종목 skeleton */}
      <PopularCompaniesSectionSkeleton />

      {/* 주요 뉴스 skeleton */}
      <MajorNewsSectionSkeleton />

      {/* 오늘의 공시 skeleton */}
      <section className="py-6 md:px-4 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          {/* PC */}
          <div className="hidden md:block">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">오늘의 공시</h2>
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
            </div>
            <div className="mb-5 h-9 w-64 animate-pulse rounded-lg bg-muted" />
            <DisclosureGridSkeleton />
          </div>

          {/* 모바일 */}
          <div className="bg-card md:hidden">
            <div className="px-4 pb-3 pt-5">
              <h2 className="text-lg font-bold">오늘의 공시</h2>
              <div className="mt-0.5 h-3.5 w-32 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-10 animate-pulse bg-muted" />
            <DisclosureSkeleton />
            <div className="px-4 py-3">
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
