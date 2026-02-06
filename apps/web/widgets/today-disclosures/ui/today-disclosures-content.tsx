'use client'

import { Suspense } from '@suspensive/react'
import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { DisclosureCardList } from './disclosure-card-list'
import { DisclosureGrid } from './disclosure-grid'
import { DisclosureSkeleton } from './disclosure-skeleton'
import { DisclosureGridSkeleton } from './disclosure-grid-skeleton'

interface DisclosureListProps {
  selectedMarket: Market
}

function DisclosureList({ selectedMarket }: DisclosureListProps) {
  const { data } = useTodayDisclosures(selectedMarket, 6)
  const disclosures = data.disclosures

  return (
    <div className="bg-card pt-2 md:bg-transparent md:pt-0">
      {/* PC 그리드 */}
      <div className="hidden md:block">
        <DisclosureGrid disclosures={disclosures} />
      </div>

      {/* 모바일 목록 */}
      <div className="pb-2 md:hidden">
        <DisclosureCardList disclosures={disclosures} />
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <>
      <div className="hidden md:block">
        <DisclosureGridSkeleton />
      </div>
      <div className="bg-card pb-2 pt-2 md:hidden">
        <DisclosureSkeleton />
      </div>
    </>
  )
}

interface TodayDisclosuresContentProps {
  selectedMarket: Market
}

export function TodayDisclosuresContent({ selectedMarket }: TodayDisclosuresContentProps) {
  return (
    <Suspense key={selectedMarket} fallback={<ContentSkeleton />}>
      <DisclosureList selectedMarket={selectedMarket} />
    </Suspense>
  )
}
