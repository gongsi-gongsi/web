'use client'

import { useState } from 'react'

import { BookOpen } from 'lucide-react'

import type { GlossaryTerm } from '@/entities/glossary'
import { GlossarySearch, useGlossaryFilter } from '@/features/glossary-search'

import { GlossaryDetailModal } from './glossary-detail-modal'
import { GlossaryDetailPanel } from './glossary-detail-panel'
import { GlossarySidebarItem } from './glossary-sidebar-item'

export function GlossaryPage() {
  const { query, setQuery, selectedCategory, setSelectedCategory, filteredTerms } =
    useGlossaryFilter()

  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(filteredTerms[0] ?? null)

  // 모바일 상세 모달
  const [mobileModalOpen, setMobileModalOpen] = useState(false)

  function handleSelect(term: GlossaryTerm) {
    setSelectedTerm(term)
    // 모바일에서는 모달로 표시
    setMobileModalOpen(true)
  }

  // 데스크톱에서 선택된 용어가 필터 결과에 없으면 첫 번째 항목 선택
  const activeTermInList = filteredTerms.find(t => t.id === selectedTerm?.id)
  const displayTerm = activeTermInList ?? filteredTerms[0] ?? null

  return (
    <>
      {/* ── 데스크톱: 좌측 사이드바 + 우측 콘텐츠 ── */}
      <div className="hidden md:flex mx-auto max-w-screen-xl h-[calc(100vh-4rem)]">
        {/* 좌측 사이드바 */}
        <aside className="w-72 shrink-0 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-primary h-5 w-5" />
              <h1 className="text-lg font-bold">투자 용어집</h1>
            </div>
            <GlossarySearch
              query={query}
              onQueryChange={setQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              resultCount={filteredTerms.length}
            />
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {filteredTerms.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                검색 결과가 없습니다.
              </p>
            ) : (
              filteredTerms.map(term => (
                <GlossarySidebarItem
                  key={term.id}
                  term={term}
                  isSelected={displayTerm?.id === term.id}
                  onSelect={t => setSelectedTerm(t)}
                />
              ))
            )}
          </nav>
        </aside>

        {/* 우측 콘텐츠 */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          {displayTerm ? (
            <GlossaryDetailPanel term={displayTerm} onSelectRelated={t => setSelectedTerm(t)} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">좌측에서 용어를 선택하세요.</p>
            </div>
          )}
        </main>
      </div>

      {/* ── 모바일: 목록 + 모달 ── */}
      <div className="md:hidden px-4 py-6 pb-24">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="text-primary h-5 w-5" />
            <h1 className="text-lg font-bold">투자 용어집</h1>
          </div>
          <p className="text-muted-foreground text-xs">
            투자에 필요한 핵심 용어들을 쉽게 이해할 수 있도록 정리했습니다.
          </p>
        </div>

        <GlossarySearch
          query={query}
          onQueryChange={setQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          resultCount={filteredTerms.length}
        />

        <div className="mt-4 space-y-1">
          {filteredTerms.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">검색 결과가 없습니다.</p>
          ) : (
            filteredTerms.map(term => (
              <GlossarySidebarItem
                key={term.id}
                term={term}
                isSelected={false}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>

        <GlossaryDetailModal
          term={selectedTerm}
          open={mobileModalOpen}
          onOpenChange={setMobileModalOpen}
          onSelectRelated={handleSelect}
        />
      </div>
    </>
  )
}
