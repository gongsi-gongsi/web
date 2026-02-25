'use client'

import { Suspense, useState, useCallback, useEffect } from 'react'

import { ErrorBoundary } from '@suspensive/react'

import { useSuggestCompanies, usePopularCompanies } from '@/entities/disclosure'
import { trackSearch } from '@/shared/lib/analytics'
import { BackButton } from '@/shared/ui/back-button'
import { MobileHeader } from '@/widgets/header'

import { SearchAutocomplete } from './ui/search-autocomplete'
import { CompanySuggestionList, CompanySuggestionSkeleton } from './ui/company-suggestion-list'
import { SearchErrorFallback } from './ui/search-error-fallback'
import { PopularCompanies, PopularCompaniesSkeleton } from './ui/popular-companies'

export function CompanySearchPage() {
  const [typingQuery, setTypingQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(typingQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [typingQuery])

  const handleSearch = useCallback((q: string) => {
    setDebouncedQuery(q)
    if (q.length >= 1) trackSearch(q)
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setTypingQuery(value)
  }, [])

  const showSuggestions = typingQuery.length >= 1
  const showSuggestionResults = showSuggestions && debouncedQuery.length >= 1

  return (
    <div className="bg-card md:bg-transparent">
      <MobileHeader
        left={<BackButton />}
        center={
          <SearchAutocomplete
            value={typingQuery}
            onSearch={handleSearch}
            onChange={handleInputChange}
            autoFocus
            className="flex-1"
            inputClassName="h-9 text-sm"
          />
        }
      />

      <div className="hidden md:block">
        <SearchAutocomplete
          value={typingQuery}
          onSearch={handleSearch}
          onChange={handleInputChange}
          autoFocus
          variant="banner"
          placeholder="기업명으로 검색해보세요"
          className="max-w-3xl"
        />
      </div>

      {showSuggestions ? (
        <div className="mt-1 md:mt-3 md:max-w-3xl">
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
