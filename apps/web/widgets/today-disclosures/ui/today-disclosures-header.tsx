'use client'

import type { Market } from '@/entities/disclosure'
import { MarketTabs } from './market-tabs'

interface TodayDisclosuresHeaderProps {
  selectedMarket: Market
  onMarketChange: (market: Market) => void
}

export function TodayDisclosuresHeader({
  selectedMarket,
  onMarketChange,
}: TodayDisclosuresHeaderProps) {
  return (
    <>
      {/* PC 버전 */}
      <div className="hidden md:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">오늘의 공시</h2>
          <span className="text-sm text-muted-foreground">공시는 1분 단위로 갱신됩니다</span>
        </div>
        <div className="mb-4">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={onMarketChange} />
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="px-4 pb-4 pt-6">
          <h2 className="text-lg font-bold">오늘의 공시</h2>
        </div>
        <div className="sticky top-14 z-40 bg-card">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={onMarketChange} />
        </div>
      </div>
    </>
  )
}
