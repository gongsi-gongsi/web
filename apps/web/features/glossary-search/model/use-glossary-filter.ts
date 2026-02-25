'use client'

import { useMemo, useState } from 'react'

import { filterGlossaryTerms, GLOSSARY_TERMS, type GlossaryCategory } from '@/entities/glossary'

/**
 * 용어집 검색 및 카테고리 필터 상태를 관리하는 훅
 * @returns 검색어, 카테고리, 필터링된 용어 목록 및 상태 변경 함수
 */
export function useGlossaryFilter() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | null>(null)

  const filteredTerms = useMemo(
    () => filterGlossaryTerms(GLOSSARY_TERMS, query, selectedCategory),
    [query, selectedCategory]
  )

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTerms,
    totalCount: GLOSSARY_TERMS.length,
  }
}
