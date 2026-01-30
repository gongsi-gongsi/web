'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { MarketTabs } from '@/widgets/today-disclosures/ui/market-tabs'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'

export function DisclosureList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMarket = (searchParams.get('market') as Market) || 'all'
  const [selectedMarket, setSelectedMarket] = useState<Market>(initialMarket)

  const { data } = useTodayDisclosures(selectedMarket)

  function handleMarketChange(market: Market) {
    setSelectedMarket(market)
    const params = new URLSearchParams(searchParams.toString())
    params.set('market', market)
    router.push(`?${params.toString()}`, { scroll: false })
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
