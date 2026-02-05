'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { MarketTabs } from '@/widgets/today-disclosures/ui/market-tabs'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'

interface DisclosureListProps {
  initialMarket: Market
}

export function DisclosureList({ initialMarket }: DisclosureListProps) {
  const router = useRouter()
  const [selectedMarket, setSelectedMarket] = useState<Market>(initialMarket)

  // 서버에서 prefetch된 데이터가 있으면 즉시 반환
  const { data } = useTodayDisclosures(selectedMarket)

  function handleMarketChange(market: Market) {
    setSelectedMarket(market)
    router.push(`?market=${market}`, { scroll: false })
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <MarketTabs selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
      </div>

      {/* PC 버전 - 테이블 */}
      <div className="hidden md:block">
        <DisclosureTable disclosures={data.disclosures} />
      </div>

      {/* 모바일 버전 - 카드 */}
      <div className="md:hidden">
        <DisclosureCardList disclosures={data.disclosures} />
      </div>

      {data.disclosures.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">등록된 공시가 없습니다</p>
        </div>
      )}
    </div>
  )
}
