'use client'

import { Suspense, useState } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import type { Market } from '@/entities/disclosure'
import { MarketTabs } from '@/widgets/today-disclosures/ui/market-tabs'
import { DisclosureContent } from './disclosure-content'
import { DisclosureListSkeleton } from './disclosure-list-skeleton'
import { ErrorFallback } from './error-fallback'

export function DisclosureList() {
  const [selectedMarket, setSelectedMarket] = useState<Market>('all')

  return (
    <>
      {/* 모바일 탭 */}
      <div className="sticky top-14 z-10 bg-card will-change-transform md:hidden">
        <MarketTabs selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} />
      </div>

      {/* PC 탭 */}
      <div className="mb-6 hidden md:block">
        <MarketTabs selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} />
      </div>

      {/* 콘텐츠 */}
      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense key={selectedMarket} fallback={<DisclosureListSkeleton />}>
          <DisclosureContent selectedMarket={selectedMarket} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
