'use client'

import { useTodayDisclosures, type Market } from '@/entities/disclosure'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'

interface DisclosureContentProps {
  selectedMarket: Market
}

export function DisclosureContent({ selectedMarket }: DisclosureContentProps) {
  const { data } = useTodayDisclosures(selectedMarket)
  const disclosures = data.disclosures

  // 빈 목록
  if (disclosures.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">등록된 공시가 없습니다</p>
      </div>
    )
  }

  return (
    <>
      {/* 모바일 버전 */}
      <div className="pb-2 pt-2 md:hidden">
        <DisclosureCardList disclosures={disclosures} />
      </div>

      {/* PC 버전 */}
      <div className="hidden md:block">
        <DisclosureTable disclosures={disclosures} />
      </div>
    </>
  )
}
