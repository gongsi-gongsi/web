'use client'

import { useQuery } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getActiveBanners } from '../api/client'

export function useActiveBanners() {
  return useQuery({
    queryKey: queries.banners.active.queryKey,
    queryFn: getActiveBanners,
    staleTime: 60 * 1000,
  })
}
