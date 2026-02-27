import type { Banner, CreateBannerData, UpdateBannerData } from './types'

export const bannerApi = {
  async getAll(): Promise<Banner[]> {
    const res = await fetch('/api/banners')
    if (!res.ok) throw new Error('배너 목록 조회 실패')
    return res.json()
  },

  async getById(id: string): Promise<Banner> {
    const res = await fetch(`/api/banners/${id}`)
    if (!res.ok) throw new Error('배너 조회 실패')
    return res.json()
  },

  async create(data: CreateBannerData): Promise<Banner> {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('배너 생성 실패')
    return res.json()
  },

  async update(id: string, data: UpdateBannerData): Promise<Banner> {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('배너 수정 실패')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('배너 삭제 실패')
  },

  async reorder(orderedIds: string[]): Promise<void> {
    const res = await fetch('/api/banners/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    })
    if (!res.ok) throw new Error('배너 순서 변경 실패')
  },
}
