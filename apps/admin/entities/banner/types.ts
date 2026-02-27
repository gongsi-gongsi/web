export interface Banner {
  id: string
  title: string
  imageUrl: string
  imageMobileUrl: string | null
  linkUrl: string | null
  order: number
  isActive: boolean
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBannerData {
  title: string
  imageUrl: string
  imageMobileUrl?: string
  linkUrl?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
}

export interface UpdateBannerData extends Partial<CreateBannerData> {}
