'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { MarketTabs } from './ui/market-tabs'
import { DisclosureCardList } from './ui/disclosure-card-list'
import { DisclosureList } from './ui/disclosure-list'
import { DisclosureSkeleton } from './ui/disclosure-skeleton'
import { DisclosureTableSkeleton } from './ui/disclosure-table-skeleton'
import { Button } from '@ds/ui'

function ErrorFallback({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">공시 정보를 불러오는데 실패했습니다</p>
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}

function TodayDisclosuresContent({ selectedMarket }: { selectedMarket: Market }) {
  const { data } = useTodayDisclosures(selectedMarket)
  const disclosures = data.disclosures.slice(0, 7)

  return (
    <>
      {/* PC 버전 */}
      <div className="hidden md:block">
        <DisclosureList disclosures={disclosures} />
      </div>

      {/* 모바일 버전 */}
      <div className="md:hidden pb-2">
        <DisclosureCardList disclosures={disclosures} />
      </div>
    </>
  )
}

export function TodayDisclosures() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMarket = (searchParams.get('market') as Market) || 'all'
  const [selectedMarket, setSelectedMarket] = useState<Market>(initialMarket)
  const { reset } = useQueryErrorResetBoundary()

  function handleMarketChange(market: Market) {
    setSelectedMarket(market)
    const params = new URLSearchParams(searchParams.toString())
    params.set('market', market)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      {/* PC 버전 */}
      <div className="hidden md:block">
        <div className="mb-4">
          <h2 className="text-xl font-bold">오늘의 공시</h2>
        </div>

        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="flex-1">
            <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
          </div>
          <Link href="/disclosures" className="shrink-0 pb-3">
            <Button variant="ghost" size="sm">
              더보기 →
            </Button>
          </Link>
        </div>

        <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
          <Suspense fallback={<DisclosureTableSkeleton />}>
            <TodayDisclosuresContent selectedMarket={selectedMarket} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* 모바일 버전 */}
      <div className="md:hidden -mx-4 bg-card">
        <div className="px-4 pb-4 pt-6">
          <h2 className="text-lg font-bold">오늘의 공시</h2>
        </div>

        <div className="mb-2">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>

        <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
          <Suspense fallback={<DisclosureSkeleton />}>
            <TodayDisclosuresContent selectedMarket={selectedMarket} />
          </Suspense>
        </ErrorBoundary>

        <div className="border-t border-border">
          <Link href="/disclosures" className="block">
            <Button variant="ghost" size="lg" className="w-full">
              더보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
