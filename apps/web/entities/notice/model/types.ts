export type NoticeCategory = 'SERVICE' | 'EVENT' | 'MAINTENANCE'

export interface NoticeListItem {
  id: string
  title: string
  category: NoticeCategory
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface NoticeDetail extends NoticeListItem {
  content: string
  author: { name: string }
}

export interface NoticeListResponse {
  data: NoticeListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
