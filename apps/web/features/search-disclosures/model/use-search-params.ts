'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import type {
  SearchDisclosuresParams,
  SearchPeriod,
  Market,
  DisclosureType,
} from '@/entities/disclosure'

type SearchParams = Omit<SearchDisclosuresParams, 'pageNo' | 'pageCount'>

/**
 * 공시 검색 URL 파라미터를 관리하는 훅입니다
 * @returns 현재 검색 파라미터와 업데이트 함수
 */
export function useDisclosureSearchParams() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const params: SearchParams = useMemo(
    () => ({
      q: searchParams.get('q') || '',
      period: (searchParams.get('period') as SearchPeriod) || '1w',
      bgnDe: searchParams.get('bgn_de') || undefined,
      endDe: searchParams.get('end_de') || undefined,
      market: (searchParams.get('market') as Market) || 'all',
      type: (searchParams.get('type') as DisclosureType | 'all') || 'all',
    }),
    [searchParams]
  )

  const updateParams = useCallback(
    (newParams: Partial<SearchParams>) => {
      const current = new URLSearchParams(searchParams.toString())

      if (newParams.q !== undefined) current.set('q', newParams.q)
      if (newParams.period !== undefined) current.set('period', newParams.period)
      if (newParams.market !== undefined) current.set('market', newParams.market)
      if (newParams.type !== undefined) current.set('type', newParams.type)

      if (newParams.bgnDe !== undefined) {
        if (newParams.bgnDe) {
          current.set('bgn_de', newParams.bgnDe)
        } else {
          current.delete('bgn_de')
        }
      }
      if (newParams.endDe !== undefined) {
        if (newParams.endDe) {
          current.set('end_de', newParams.endDe)
        } else {
          current.delete('end_de')
        }
      }

      router.replace(`${pathname}?${current.toString()}`)
    },
    [searchParams, router, pathname]
  )

  return { params, updateParams }
}
