import { getBaseUrl } from '@/shared/lib/get-base-url'
import type { Banner } from '../model/types'

/**
 * 현재 활성화된 배너 목록을 가져옵니다
 * @returns 순서대로 정렬된 활성 배너 배열
 */
export async function getActiveBanners(): Promise<Banner[]> {
  const res = await fetch(`${getBaseUrl()}/api/banners`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Failed to fetch banners')
  return res.json()
}
