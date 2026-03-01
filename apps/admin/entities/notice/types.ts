export type NoticeCategory = 'SERVICE' | 'EVENT' | 'MAINTENANCE'

export const NOTICE_CATEGORY_LABELS: Record<NoticeCategory, string> = {
  SERVICE: '서비스',
  EVENT: '이벤트',
  MAINTENANCE: '점검',
}

export interface Notice {
  id: string
  title: string
  category: NoticeCategory
  content: string
  authorId: string
  isPublished: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
  author: { name: string }
}

export interface NoticeListResponse {
  data: Notice[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateNoticeData {
  title: string
  category: NoticeCategory
  content: string
  isPublished?: boolean
  isPinned?: boolean
}

export interface UpdateNoticeData extends Partial<CreateNoticeData> {}
