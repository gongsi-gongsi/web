'use client'

import { Search, X } from 'lucide-react'

import { Badge, Input } from '@gs/ui'

import { GLOSSARY_CATEGORY_LABEL, type GlossaryCategory } from '@/entities/glossary'

interface GlossarySearchProps {
  query: string
  onQueryChange: (query: string) => void
  selectedCategory: GlossaryCategory | null
  onCategoryChange: (category: GlossaryCategory | null) => void
  resultCount: number
}

const CATEGORIES = Object.entries(GLOSSARY_CATEGORY_LABEL) as [GlossaryCategory, string][]

export function GlossarySearch({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  resultCount,
}: GlossarySearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="용어를 검색하세요 (예: PER, 시가총액, ROE)"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => onCategoryChange(null)}
        >
          전체
        </Badge>
        {CATEGORIES.map(([key, label]) => (
          <Badge
            key={key}
            variant={selectedCategory === key ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => onCategoryChange(selectedCategory === key ? null : key)}
          >
            {label}
          </Badge>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">
        {query || selectedCategory ? `검색 결과 ${resultCount}개` : `총 ${resultCount}개의 용어`}
      </p>
    </div>
  )
}
