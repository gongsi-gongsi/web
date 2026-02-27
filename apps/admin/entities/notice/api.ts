import type { Notice, NoticeListResponse, CreateNoticeData, UpdateNoticeData } from './types'

interface NoticeListParams {
  page?: number
  limit?: number
  category?: string
}

export const noticeApi = {
  async getAll(params: NoticeListParams = {}): Promise<NoticeListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.category) searchParams.set('category', params.category)

    const res = await fetch(`/api/notices?${searchParams.toString()}`)
    if (!res.ok) throw new Error('공지사항 목록 조회 실패')
    return res.json()
  },

  async getById(id: string): Promise<Notice> {
    const res = await fetch(`/api/notices/${id}`)
    if (!res.ok) throw new Error('공지사항 조회 실패')
    return res.json()
  },

  async create(data: CreateNoticeData): Promise<Notice> {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('공지사항 생성 실패')
    return res.json()
  },

  async update(id: string, data: UpdateNoticeData): Promise<Notice> {
    const res = await fetch(`/api/notices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('공지사항 수정 실패')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('공지사항 삭제 실패')
  },
}
