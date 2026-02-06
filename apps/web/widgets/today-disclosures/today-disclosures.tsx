'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@gs/ui'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { MarketTabs } from './ui/market-tabs'
import { DisclosureCardList } from './ui/disclosure-card-list'
import { DisclosureList } from './ui/disclosure-list'
import { DisclosureSkeleton } from './ui/disclosure-skeleton'
import { DisclosureTableSkeleton } from './ui/disclosure-table-skeleton'

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

function TodayDisclosuresContent({ selectedMarket }: { selectedMarket: Market }) {
  const { data } = useTodayDisclosures(selectedMarket, 7)
  const disclosures = data.disclosures // 이미 7개만 조회하므로 slice 불필요

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

const VALID_MARKETS: Market[] = ['all', 'kospi', 'kosdaq', 'konex', 'etc']

function isValidMarket(value: string | null): value is Market {
  return value !== null && VALID_MARKETS.includes(value as Market)
}

export function TodayDisclosures() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const marketParam = searchParams.get('market')
  const initialMarket: Market = isValidMarket(marketParam) ? marketParam : 'all'
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">오늘의 공시</h2>
          <span className="text-sm text-muted-foreground">공시는 1분 단위로 갱신됩니다</span>
        </div>

        <div className="mb-4">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>

        <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
          <Suspense key={selectedMarket} fallback={<DisclosureTableSkeleton />}>
            <TodayDisclosuresContent selectedMarket={selectedMarket} />
          </Suspense>
        </ErrorBoundary>

        <div className="mt-4 flex justify-center">
          <Link href="/disclosures/today">
            <Button variant="ghost" size="sm">
              더보기 →
            </Button>
          </Link>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="md:hidden bg-card">
        <div className="pb-4 pt-6 px-4">
          <h2 className="text-lg font-bold">오늘의 공시</h2>
        </div>

        <div className="sticky top-14 z-40 mb-2 bg-card">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
        </div>

        <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
          <Suspense key={selectedMarket} fallback={<DisclosureSkeleton />}>
            <TodayDisclosuresContent selectedMarket={selectedMarket} />
          </Suspense>
        </ErrorBoundary>

        <div className="border-t border-border">
          <Link href="/disclosures/today" className="block">
            <Button variant="ghost" size="xl" className="w-full text-muted-foreground">
              더보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
