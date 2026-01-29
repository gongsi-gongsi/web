import type { Market, TodayDisclosuresResponse } from '../model/types'

export async function getTodayDisclosures(
  market: Market = 'all'
): Promise<TodayDisclosuresResponse> {
  const params = new URLSearchParams({ market })
  const response = await fetch(`/api/disclosures/today?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch today disclosures')
  }

  return response.json()
}
