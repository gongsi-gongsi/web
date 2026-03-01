import type { AdminUserInfo, UserListResponse, UserWatchlistItem, UpdateUserData } from './types'

interface UserListParams {
  page?: number
  limit?: number
  search?: string
}

export const userApi = {
  async getAll(params: UserListParams = {}): Promise<UserListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.search) searchParams.set('search', params.search)

    const res = await fetch(`/api/users?${searchParams.toString()}`)
    if (!res.ok) throw new Error('유저 목록 조회 실패')
    return res.json()
  },

  async getById(id: string): Promise<AdminUserInfo> {
    const res = await fetch(`/api/users/${id}`)
    if (!res.ok) throw new Error('유저 조회 실패')
    return res.json()
  },

  async update(id: string, data: UpdateUserData): Promise<AdminUserInfo> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('유저 수정 실패')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('유저 삭제 실패')
  },

  async getWatchlist(id: string): Promise<UserWatchlistItem[]> {
    const res = await fetch(`/api/users/${id}/watchlist`)
    if (!res.ok) throw new Error('관심종목 조회 실패')
    return res.json()
  },
}
