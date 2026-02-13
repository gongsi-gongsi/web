'use client'

import { Suspense, useState, useCallback, useEffect } from 'react'

import { ErrorBoundary } from '@suspensive/react'

import type { SearchPeriod, Market, DisclosureType } from '@/entities/disclosure'
import { useSuggestCompanies, usePopularCompanies } from '@/entities/disclosure'
import { useDisclosureSearchParams } from '@/features/search-disclosures'
import { BackButton } from '@/shared/ui/back-button'
import { MobileHeader } from '@/widgets/header'

import { SearchAutocomplete } from './ui/search-autocomplete'
import { CompanySuggestionList, CompanySuggestionSkeleton } from './ui/company-suggestion-list'
import { SearchFilterModal } from './ui/search-filter-modal'
import { SearchFilterChips } from './ui/search-filter-chips'
import { SearchResultContent } from './ui/search-result-content'
import { SearchResultSkeleton } from './ui/search-result-skeleton'
import { SearchErrorFallback } from './ui/search-error-fallback'
import { PopularCompanies, PopularCompaniesSkeleton } from './ui/popular-companies'

export function DisclosureSearchPage() {
  const { params, updateParams } = useDisclosureSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [typingQuery, setTypingQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSuggestionMode, setIsSuggestionMode] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(typingQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [typingQuery])

  const handleSearch = useCallback(
    (q: string) => {
      setIsSuggestionMode(false)
      updateParams({ q })
    },
    [updateParams]
  )

  const handleInputChange = useCallback((value: string) => {
    setTypingQuery(value)
    setIsSuggestionMode(value.length > 0)
  }, [])

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setIsInputFocused(false), 150)
  }, [])

  const handlePeriodChange = useCallback(
    (period: SearchPeriod) => {
      updateParams({ period })
    },
    [updateParams]
  )

  function handleFilterApply(filterParams: {
    period: SearchPeriod
    market: Market
    type: DisclosureType | 'all'
  }) {
    updateParams(filterParams)
  }

  const showSuggestions = isSuggestionMode && typingQuery.length >= 1
  const showSuggestionResults = showSuggestions && debouncedQuery.length >= 1
  const showPopular = isInputFocused && !showSuggestions

  return (
    <div className="bg-card md:bg-transparent">
      {/* 모바일 헤더: 뒤로가기 + 검색 인풋 */}
      <MobileHeader
        left={<BackButton />}
        center={
          <SearchAutocomplete
            value={params.q}
            onSearch={handleSearch}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoFocus
            className="flex-1"
            inputClassName="h-9 text-sm"
          />
        }
      />

      {/* PC: 검색바 */}
      <div className="hidden md:block">
        <SearchAutocomplete
          value={params.q}
          onSearch={handleSearch}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoFocus
          className="flex-1"
        />
      </div>

      {showSuggestions ? (
        <div className="mt-2">
          {showSuggestionResults ? (
            <ErrorBoundary fallback={SearchErrorFallback}>
              <Suspense key={debouncedQuery} fallback={<CompanySuggestionSkeleton />}>
                <SuggestionResult query={debouncedQuery} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <CompanySuggestionSkeleton />
          )}
        </div>
      ) : showPopular ? (
        <ErrorBoundary fallback={SearchErrorFallback}>
          <Suspense fallback={<PopularCompaniesSkeleton />}>
            <PopularCompaniesResult />
          </Suspense>
        </ErrorBoundary>
      ) : params.q ? (
        <>
          {/* 필터 바: 필터 아이콘 + 기간 칩 */}
          <SearchFilterChips
            period={params.period}
            onPeriodChange={handlePeriodChange}
            onFilterOpen={() => setFilterOpen(true)}
          />

          {/* 필터 모달 (시장, 공시유형) */}
          <SearchFilterModal
            open={filterOpen}
            onOpenChange={setFilterOpen}
            params={{
              period: params.period,
              market: params.market,
              type: params.type,
            }}
            onApply={handleFilterApply}
          />

          {/* 검색 결과 */}
          <ErrorBoundary fallback={SearchErrorFallback}>
            <Suspense
              key={`${params.q}-${params.period}-${params.market}-${params.type}`}
              fallback={<SearchResultSkeleton />}
            >
              <SearchResultContent params={params} />
            </Suspense>
          </ErrorBoundary>
        </>
      ) : (
        <ErrorBoundary fallback={SearchErrorFallback}>
          <Suspense fallback={<PopularCompaniesSkeleton />}>
            <PopularCompaniesResult />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}

interface SuggestionResultProps {
  query: string
}

function SuggestionResult({ query }: SuggestionResultProps) {
  const { data: suggestions } = useSuggestCompanies(query)

  return <CompanySuggestionList suggestions={suggestions} query={query} />
}

function PopularCompaniesResult() {
  const { data: companies } = usePopularCompanies()

  return <PopularCompanies companies={companies} />
}
