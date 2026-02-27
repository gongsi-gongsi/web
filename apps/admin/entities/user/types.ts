export interface AdminUserInfo {
  id: string
  email: string | null
  name: string | null
  telegramChatId: string | null
  notificationEmail: boolean
  notificationTelegram: boolean
  createdAt: string
  updatedAt: string
  _count: {
    watchlist: number
    aiReports: number
    notifications: number
  }
}

export interface UserListItem {
  id: string
  email: string | null
  name: string | null
  createdAt: string
  _count: { watchlist: number }
}

export interface UserListResponse {
  data: UserListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserWatchlistItem {
  id: string
  createdAt: string
  stock: {
    id: string
    stockCode: string
    corpCode: string
    corpName: string
    market: string | null
  }
}

export interface UpdateUserData {
  name?: string
  notificationEmail?: boolean
  notificationTelegram?: boolean
}
