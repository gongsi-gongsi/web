'use client'

import { useState } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@gs/ui'
import type { Market } from '@/entities/disclosure'
import { TodayDisclosuresHeader } from './ui/today-disclosures-header'
import { TodayDisclosuresContent } from './ui/today-disclosures-content'
import { TodayDisclosuresFooter } from './ui/today-disclosures-footer'

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
  const [selectedMarket, setSelectedMarket] = useState<Market>('all')
  const { reset } = useQueryErrorResetBoundary()

  return (
    <div className="w-full">
      <TodayDisclosuresHeader selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} />

      <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
        <TodayDisclosuresContent selectedMarket={selectedMarket} />
      </ErrorBoundary>

      <TodayDisclosuresFooter />
    </div>
  )
}
