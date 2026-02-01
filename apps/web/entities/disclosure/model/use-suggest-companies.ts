'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { suggestCompanies } from '../api/suggest-companies'

/**
 * 회사명 자동완성을 위한 쿼리 훅입니다
 * 300ms debounce가 적용되어 입력이 멈춘 후 API를 호출합니다
 * @param query - 검색할 회사명
 * @returns 자동완성 결과와 로딩 상태
 */
export function useSuggestCompanies(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    ...queries.stocks.suggest(debouncedQuery),
    queryFn: () => suggestCompanies(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 60000,
  })
}
