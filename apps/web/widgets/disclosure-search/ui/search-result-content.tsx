'use client'

import { useEffect, useMemo } from 'react'

import {
  useSearchDisclosures,
  deduplicateDisclosures,
  type SearchDisclosuresParams,
} from '@/entities/disclosure'
import { useSummarizedDisclosureIds } from '@/features/ai-disclosure-summary'
import { useIntersectionObserver } from '@/shared/hooks'
import { DisclosureTable } from '@/widgets/today-disclosures/ui/disclosure-table'
import { DisclosureCardList } from '@/widgets/today-disclosures/ui/disclosure-card-list'

import { SearchResultHeader } from './search-result-header'

interface SearchResultContentProps {
  params: Omit<SearchDisclosuresParams, 'pageNo' | 'pageCount'>
}

export function SearchResultContent({ params }: SearchResultContentProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchDisclosures(params)
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
  const totalCount = data.pages[0]?.totalCount ?? 0

  return (
    <>
      <SearchResultHeader query={params.q} totalCount={totalCount} />

      {disclosures.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">해당 회사의 공시를 찾을 수 없습니다</p>
          <p className="mt-2 text-xs text-muted-foreground">
            다른 회사명을 입력하거나 필터를 변경해 보세요
          </p>
        </div>
      ) : (
        <>
          {/* 모바일 버전 */}
          <div className="pb-2 pt-2 md:hidden">
            <DisclosureCardList disclosures={disclosures} showMeta summarizedIds={summarizedIds} />
          </div>

          {/* PC 버전 */}
          <div className="hidden md:block">
            <DisclosureTable disclosures={disclosures} showMeta summarizedIds={summarizedIds} />
          </div>
        </>
      )}

      {/* 스크롤 감지 영역 및 상태 표시 */}
      <div ref={ref} className="py-6 text-center">
        {isFetchingNextPage && (
          <p className="text-sm text-muted-foreground">공시를 불러오는 중...</p>
        )}
        {!hasNextPage && disclosures.length > 0 && (
          <p className="text-sm text-muted-foreground">모든 검색 결과를 불러왔습니다</p>
        )}
      </div>
    </>
  )
}
