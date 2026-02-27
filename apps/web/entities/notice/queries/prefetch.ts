import { QueryClient, dehydrate } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getNotices, getNotice } from '../api/client'

/**
 * [서버 컴포넌트용] 공지사항 목록 데이터를 prefetch합니다
 * @param params - 페이지 번호, 카테고리 필터
 * @returns Dehydrated state (HydrationBoundary에 전달)
 */
export async function prefetchNotices(params: { page?: number; category?: string } = {}) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queries.notices.list(params).queryKey,
    queryFn: () => getNotices(params),
    staleTime: 60 * 1000,
  })

  return dehydrate(queryClient)
}

/**
 * [서버 컴포넌트용] 공지사항 상세 데이터를 prefetch합니다
 * @param id - 공지사항 ID
 * @returns Dehydrated state (HydrationBoundary에 전달)
 */
export async function prefetchNotice(id: string) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queries.notices.detail(id).queryKey,
    queryFn: () => getNotice(id),
    staleTime: 60 * 1000,
  })

  return dehydrate(queryClient)
}
