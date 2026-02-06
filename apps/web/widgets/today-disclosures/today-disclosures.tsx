'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@gs/ui'
import type { Market } from '@/entities/disclosure'
import { TodayDisclosuresHeader } from './ui/today-disclosures-header'
import { TodayDisclosuresContent } from './ui/today-disclosures-content'
import { TodayDisclosuresFooter } from './ui/today-disclosures-footer'

const VALID_MARKETS: Market[] = ['all', 'kospi', 'kosdaq', 'konex', 'etc']

function isValidMarket(value: string | null): value is Market {
  return value !== null && VALID_MARKETS.includes(value as Market)
}

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

function ErrorFallback({ reset }: ErrorFallbackProps) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">공시 정보를 불러오는데 실패했습니다</p>
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
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
      <TodayDisclosuresHeader selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />

      <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
        <TodayDisclosuresContent selectedMarket={selectedMarket} />
      </ErrorBoundary>

      <TodayDisclosuresFooter />
    </div>
  )
}
