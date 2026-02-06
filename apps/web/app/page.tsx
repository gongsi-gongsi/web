import { Suspense } from 'react'
import Link from 'next/link'
import { HydrationBoundary } from '@tanstack/react-query'

import { MagnifyingGlassIcon, ListIcon } from '@phosphor-icons/react/dist/ssr'

import { Input } from '@gs/ui'
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

        {/* 서비스 배너 */}
        <section className="relative h-[400px] w-full bg-linear-to-br from-primary/5 to-primary/10 px-4 md:h-[500px] lg:px-8">
          <div className="mx-auto flex h-full max-w-screen-2xl items-center">
            <div className="max-w-2xl">
              {/* 작은 텍스트 */}
              <p className="text-sm font-medium text-muted-foreground md:text-base mb-2">
                주식 투자자를 위한 기업 분석과 레포트 제공
              </p>

              {/* 메인 텍스트 */}
              <div className="text-2xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl mb-10">
                읽기 어려운 공시,
                <br />
                <span className="text-primary">AI 애널리스트</span>가 요약해드려요
              </div>

              {/* 검색바 */}
              <div className="relative max-w-xl">
                <Input
                  type="text"
                  placeholder="기업명 또는 종목 코드를 검색해보세요"
                  className="h-12 pr-12 text-base md:h-14 md:text-lg"
                />
                <button
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 md:size-10"
                  aria-label="검색"
                >
                  <MagnifyingGlassIcon className="size-5 md:size-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-screen-2xl">
            <Suspense>
              <TodayDisclosures />
            </Suspense>
          </div>
        </section>
      </main>
    </HydrationBoundary>
  )
}
