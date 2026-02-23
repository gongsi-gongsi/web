'use client'

import { useEffect, useMemo } from 'react'

import {
  useInfiniteTodayDisclosures,
  deduplicateDisclosures,
  type Market,
} from '@/entities/disclosure'
import { useSummarizedDisclosureIds } from '@/features/ai-disclosure-summary'
import { useIntersectionObserver } from '@/shared/hooks'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'

interface DisclosureContentProps {
  selectedMarket: Market
}

export function DisclosureContent({ selectedMarket }: DisclosureContentProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTodayDisclosures(selectedMarket)

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

  const disclosures = useMemo(
    () => deduplicateDisclosures(data.pages.flatMap(page => page.disclosures)),
    [data.pages]
  )

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
        <DisclosureCardList disclosures={disclosures} summarizedIds={summarizedIds} />
      </div>

      {/* PC 버전 */}
      <div className="hidden md:block">
        <DisclosureTable disclosures={disclosures} summarizedIds={summarizedIds} />
      </div>

      {/* 스크롤 감지 영역 및 상태 표시 */}
      <div ref={ref} className="py-6 text-center">
        {isFetchingNextPage && (
          <p className="text-sm text-muted-foreground">공시를 불러오는 중...</p>
        )}
        {!hasNextPage && disclosures.length > 0 && (
          <p className="text-sm text-muted-foreground">모든 공시를 불러왔습니다</p>
        )}
      </div>
    </>
  )
}
