'use client'

import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

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
        <div className="mb-5 flex items-end justify-between">
          <div className="border-l-[3px] border-primary pl-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold">오늘의 공시</h2>
              <span className="flex items-center gap-1.5 rounded-full bg-success-weak px-2 py-0.5 text-[11px] font-medium text-success-weak-foreground">
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
                실시간
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">1분마다 자동 갱신</p>
          </div>
          <Link
            href="/disclosures/today"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            전체보기
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mb-5">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={onMarketChange} />
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="flex items-end justify-between px-4 pb-3 pt-5">
          <div className="border-l-[3px] border-primary pl-3">
            <h2 className="text-xl font-bold">오늘의 공시</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">1분 단위 실시간 갱신</p>
          </div>
          <Link
            href="/disclosures/today"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            전체보기
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="sticky top-14 z-40 bg-card">
          <MarketTabs selectedMarket={selectedMarket} onMarketChange={onMarketChange} />
        </div>
      </div>
    </>
  )
}
