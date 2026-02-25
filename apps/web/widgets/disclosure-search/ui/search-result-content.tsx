'use client'

import { useEffect, useMemo } from 'react'

import { MagnifyingGlassIcon } from '@phosphor-icons/react'

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
        <div className="py-16 text-center">
          <MagnifyingGlassIcon className="mx-auto mb-3 size-12 text-muted-foreground/40" />
          <p className="text-base font-medium text-foreground">검색 결과가 없습니다</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            다른 회사명을 입력하거나 필터를 변경해 보세요
          </p>
        </div>
      ) : (
        <>
          <div className="pt-1 pb-2 md:hidden">
            <DisclosureCardList disclosures={disclosures} showMeta summarizedIds={summarizedIds} />
          </div>

          <div className="hidden md:block">
            <DisclosureTable disclosures={disclosures} showMeta summarizedIds={summarizedIds} />
          </div>
        </>
      )}

      <div ref={ref} className="py-8 text-center">
        {isFetchingNextPage && (
          <p className="text-sm text-muted-foreground">공시를 불러오는 중...</p>
        )}
        {!hasNextPage && disclosures.length > 0 && (
          <p className="text-xs text-muted-foreground/60">모든 검색 결과를 불러왔습니다</p>
        )}
      </div>
    </>
  )
}
