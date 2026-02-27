'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getNotices, getNotice } from '../api/client'

/**
 * 공지사항 목록을 가져오는 훅
 * @param params - 페이지 번호, 카테고리 필터
 * @returns 공지사항 목록 및 페이지네이션 정보
 */
export function useNotices(params: { page?: number; category?: string } = {}) {
  return useSuspenseQuery({
    queryKey: queries.notices.list(params).queryKey,
    queryFn: () => getNotices(params),
    staleTime: 60 * 1000,
  })
}

/**
 * 공지사항 상세를 가져오는 훅
 * @param id - 공지사항 ID
 * @returns 공지사항 상세 정보
 */
export function useNotice(id: string) {
  return useSuspenseQuery({
    queryKey: queries.notices.detail(id).queryKey,
    queryFn: () => getNotice(id),
    staleTime: 60 * 1000,
  })
}
