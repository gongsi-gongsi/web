'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@gs/ui'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { MarketTabs } from './ui/market-tabs'
import { DisclosureCardList } from './ui/disclosure-card-list'
import { DisclosureGrid } from './ui/disclosure-grid'
import { DisclosureSkeleton } from './ui/disclosure-skeleton'
import { DisclosureGridSkeleton } from './ui/disclosure-grid-skeleton'

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

function ErrorFallback({ reset, error: _error }: ErrorFallbackProps) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">공시 정보를 불러오는데 실패했습니다</p>
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}

interface DisclosureListContentProps {
  selectedMarket: Market
}

function DisclosureListContent({ selectedMarket }: DisclosureListContentProps) {
  const { data } = useTodayDisclosures(selectedMarket, 6)
  const disclosures = data.disclosures

  return (
    <>
      {/* PC 그리드 */}
      <div className="hidden md:block">
        <DisclosureGrid disclosures={disclosures} />
      </div>

      {/* 모바일 목록 */}
      <div className="pb-2 md:hidden">
        <DisclosureCardList disclosures={disclosures} />
      </div>
    </>
  )
}

const VALID_MARKETS: Market[] = ['all', 'kospi', 'kosdaq', 'konex', 'etc']

function isValidMarket(value: string | null): value is Market {
  return value !== null && VALID_MARKETS.includes(value as Market)
}

export function TodayDisclosures() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { reset } = useQueryErrorResetBoundary()

  const marketParam = searchParams.get('market')
  const selectedMarket: Market = isValidMarket(marketParam) ? marketParam : 'all'

  function handleMarketChange(market: Market) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('market', market)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      {/* ===== PC 버전 ===== */}
      <div className="hidden md:block">
        {/* PC 타이틀 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">오늘의 공시</h2>
          <span className="text-sm text-muted-foreground">공시는 1분 단위로 갱신됩니다</span>
        </div>

        {/* PC 탭 */}
        <div className="mb-4">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>
      </div>

      {/* ===== 모바일 버전 ===== */}
      <div className="bg-card md:hidden">
        {/* 모바일 타이틀 */}
        <div className="px-4 pb-4 pt-6">
          <h2 className="text-lg font-bold">오늘의 공시</h2>
        </div>

        {/* 모바일 탭 */}
        <div className="sticky top-14 z-40 bg-card">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>
      </div>

      {/* ===== 공시 목록 (PC/모바일 공통 - Suspense) ===== */}
      <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
        <Suspense
          key={selectedMarket}
          fallback={
            <>
              <div className="hidden md:block">
                <DisclosureGridSkeleton />
              </div>
              <div className="bg-card pb-2 pt-2 md:hidden">
                <DisclosureSkeleton />
              </div>
            </>
          }
        >
          <div className="bg-card pt-2 md:bg-transparent md:pt-0">
            <DisclosureListContent selectedMarket={selectedMarket} />
          </div>
        </Suspense>
      </ErrorBoundary>

      {/* ===== 더보기 버튼 ===== */}
      {/* PC 더보기 */}
      <div className="mt-4 hidden justify-center md:flex">
        <Link href="/disclosures/today">
          <Button variant="ghost" size="sm">
            더보기 →
          </Button>
        </Link>
      </div>

      {/* 모바일 더보기 */}
      <div className="border-t border-border bg-card md:hidden">
        <Link href="/disclosures/today" className="block">
          <Button variant="ghost" size="xl" className="h-16 w-full text-muted-foreground">
            더보기
          </Button>
        </Link>
      </div>
    </div>
  )
}
