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
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">오늘의 공시</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-success-weak px-2 py-0.5 text-[11px] font-medium text-success-weak-foreground">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
              실시간
            </span>
          </div>
          <span className="text-xs text-muted-foreground">1분마다 자동 갱신</span>
        </div>
        <div className="mb-5">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={onMarketChange} />
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="px-4 pb-3 pt-5">
          <h2 className="text-lg font-bold">오늘의 공시</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">1분 단위 실시간 갱신</p>
        </div>
        <div className="sticky top-14 z-40 bg-card">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={onMarketChange} />
        </div>
      </div>
    </>
  )
}
