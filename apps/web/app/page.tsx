import { Suspense } from 'react'
import Link from 'next/link'
import { HydrationBoundary } from '@tanstack/react-query'

import { MagnifyingGlassIcon, ListIcon } from '@phosphor-icons/react/dist/ssr'

import { MobileHeader } from '@/widgets/header'
import { TodayDisclosures } from '@/widgets/today-disclosures'
import { prefetchTodayDisclosures } from '@/entities/disclosure/server'

export default async function Home() {
  // 서버에서 데이터 prefetch (메인 페이지는 7개만 조회)
  const dehydratedState = await prefetchTodayDisclosures('all', 7)

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="min-h-screen bg-background">
        <MobileHeader
          left={
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold">공시공시</span>
            </Link>
          }
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
        <div className="mx-auto max-w-screen-2xl py-8 md:px-4 lg:px-8">
          <Suspense>
            <TodayDisclosures />
          </Suspense>
        </div>
      </main>
    </HydrationBoundary>
  )
}
