'use client'

import { useEffect, useMemo, useState } from 'react'

import type { SearchPeriod, DisclosureType } from '@/entities/disclosure'
import { useCompanyDisclosures, deduplicateDisclosures } from '@/entities/disclosure'
import { useSummarizedDisclosureIds } from '@/features/ai-disclosure-summary'
import { useIntersectionObserver } from '@/shared/hooks'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'

import { CompanyDisclosureFilterChips } from './company-disclosure-filter-chips'
import { CompanyDisclosureFilterModal } from './company-disclosure-filter-modal'

interface CompanyDisclosureSectionProps {
  corpCode: string
}

export function CompanyDisclosureSection({ corpCode }: CompanyDisclosureSectionProps) {
  const [period, setPeriod] = useState<SearchPeriod>('3m')
  const [type, setType] = useState<DisclosureType | 'all'>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCompanyDisclosures(corpCode, {
    period,
    type,
  })
  const { data: summaryIds } = useSummarizedDisclosureIds()
  const summarizedIds = useMemo(() => new Set(summaryIds ?? []), [summaryIds])

  const { ref, inView } = useIntersectionObserver({
    rootMargin: '200px',
    enabled: hasNextPage && !isFetchingNextPage,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  const disclosures = deduplicateDisclosures(data.pages.flatMap(page => page.disclosures))

  const emptyMessage =
    type !== 'all'
      ? '조건에 맞는 공시가 없습니다'
      : period === 'all'
        ? '공시가 없습니다'
        : `최근 ${period === 'today' ? '오늘' : period === '1w' ? '1주일' : '3개월'}간 공시가 없습니다`

  return (
    <>
      <CompanyDisclosureFilterChips
        period={period}
        onPeriodChange={setPeriod}
        onFilterOpen={() => setFilterOpen(true)}
      />

      <CompanyDisclosureFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        type={type}
        onApply={setType}
      />

      {disclosures.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* 모바일 버전 */}
          <div className="pb-2 md:hidden">
            <DisclosureCardList disclosures={disclosures} showMeta summarizedIds={summarizedIds} />
          </div>

          {/* PC 버전 */}
          <div className="hidden md:block">
            <DisclosureTable disclosures={disclosures} showMeta summarizedIds={summarizedIds} />
          </div>

          {/* 스크롤 감지 영역 및 상태 표시 */}
          <div ref={ref} className="py-6 text-center">
            {isFetchingNextPage && (
              <p className="text-muted-foreground text-sm">공시를 불러오는 중...</p>
            )}
            {!hasNextPage && disclosures.length > 0 && (
              <p className="text-muted-foreground text-sm">모든 공시를 불러왔습니다</p>
            )}
          </div>
        </>
      )}
    </>
  )
}
