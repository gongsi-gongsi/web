'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ErrorBoundary } from '@suspensive/react'
import type { Market } from '@/entities/disclosure'
import { MarketTabs } from '@/widgets/today-disclosures/ui/market-tabs'
import { DisclosureContent } from './disclosure-content'
import { DisclosureListSkeleton } from './disclosure-list-skeleton'
import { ErrorFallback } from './error-fallback'

const VALID_MARKETS: Market[] = ['all', 'kospi', 'kosdaq', 'konex', 'etc']

function isValidMarket(value: string | null): value is Market {
  return value !== null && VALID_MARKETS.includes(value as Market)
}

export function DisclosureList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL을 Single Source of Truth로 사용
  const marketParam = searchParams.get('market')
  const selectedMarket: Market = isValidMarket(marketParam) ? marketParam : 'all'

  function handleMarketChange(market: Market) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('market', market)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      {/* 모바일 버전 */}
      <div className="md:hidden">
        {/* 탭바 - sticky (항상 표시) */}
        <div className="sticky top-14 z-10 bg-card will-change-transform">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>

        {/* 카드 리스트 (Suspense) */}
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense key={selectedMarket} fallback={<DisclosureListSkeleton />}>
            <DisclosureContent selectedMarket={selectedMarket} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* PC 버전 */}
      <div className="hidden md:block">
        {/* 탭바 (항상 표시) */}
        <div className="mb-6">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>

        {/* 테이블 (Suspense) */}
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense key={selectedMarket} fallback={<DisclosureListSkeleton />}>
            <DisclosureContent selectedMarket={selectedMarket} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}
