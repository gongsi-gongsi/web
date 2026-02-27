import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { NoticeListResponse, NoticeDetail } from '../model/types'

/**
 * 공개된 공지사항 목록을 가져옵니다
 * @param params - 페이지 번호, 카테고리 필터
 * @returns 공지사항 목록 및 페이지네이션 정보
 */
export async function getNotices(
  params: { page?: number; category?: string; limit?: number } = {}
): Promise<NoticeListResponse> {
  const searchParams = new URLSearchParams()
  if (params.page != null) searchParams.set('page', String(params.page))
  if (params.category) searchParams.set('category', params.category)
  if (params.limit != null) searchParams.set('limit', String(params.limit))

  const res = await fetch(`${getBaseUrl()}/api/notices?${searchParams}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch notices')
  return res.json()
}

/**
 * 공지사항 상세 내용을 가져옵니다
 * @param id - 공지사항 ID
 * @returns 공지사항 상세 정보
 */
export async function getNotice(id: string): Promise<NoticeDetail> {
  const res = await fetch(`${getBaseUrl()}/api/notices/${id}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch notice')
  return res.json()
}
