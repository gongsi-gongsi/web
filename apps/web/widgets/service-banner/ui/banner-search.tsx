'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter } from 'next/navigation'

import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { ErrorBoundary } from '@suspensive/react'

import { Button, Input } from '@gs/ui'

import { useSuggestCompanies } from '@/entities/disclosure'
import {
  CompanySuggestionList,
  CompanySuggestionSkeleton,
  SearchErrorFallback,
} from '@/widgets/disclosure-search'

export function BannerSearch() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [typingQuery, setTypingQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // 디바운스: 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(typingQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [typingQuery])

  // 외부 클릭 처리
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  // Escape 키 처리
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleFocus = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTypingQuery(e.target.value)
    setIsOpen(true)
  }, [])

  const handleClear = useCallback(() => {
    setTypingQuery('')
    setDebouncedQuery('')
  }, [])

  const handleSearch = useCallback(() => {
    if (typingQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(typingQuery.trim())}`)
      setIsOpen(false)
    }
  }, [typingQuery, router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  return (
    <div ref={containerRef} className="relative mx-auto max-w-xl">
      {/* 검색 인풋 */}
      <div className="relative rounded-2xl border border-border bg-background shadow-sm">
        <Input
          type="text"
          placeholder="기업명으로 검색해보세요"
          value={typingQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="h-12 border-none bg-transparent pl-4 pr-24 text-base shadow-none outline-none placeholder:text-foreground/40 focus:outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 md:h-14 md:text-lg"
        />

        {/* X(클리어) 버튼: 입력값 있을 때만 표시 */}
        {typingQuery && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className="absolute right-14 top-1/2 -translate-y-1/2 transition-all"
            aria-label="입력 초기화"
          >
            <XIcon className="size-5" weight="bold" />
          </Button>
        )}

        {/* 검색 버튼 */}
        <Button
          size="icon"
          interactive
          onClick={handleSearch}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 shadow-md transition-all md:right-2 md:size-11"
          aria-label="검색"
        >
          <MagnifyingGlassIcon className="size-5 md:size-6" weight="bold" />
        </Button>
      </div>

      {/* 자동완성 드롭다운 */}
      {isOpen && typingQuery.length >= 1 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[360px] overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
          {debouncedQuery.length >= 1 ? (
            <ErrorBoundary fallback={SearchErrorFallback}>
              <Suspense key={debouncedQuery} fallback={<CompanySuggestionSkeleton />}>
                <SuggestionResult query={debouncedQuery} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <CompanySuggestionSkeleton />
          )}
        </div>
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
