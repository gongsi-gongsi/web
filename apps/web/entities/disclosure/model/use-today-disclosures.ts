import { useSuspenseQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { getTodayDisclosures } from '../api/get-today-disclosures'
import type { Market } from './types'

export function useTodayDisclosures(market: Market = 'all') {
  return useSuspenseQuery({
    ...queries.disclosures.today(market),
    queryFn: () => getTodayDisclosures(market),
    refetchInterval: 30000, // 30초마다 자동 refetch
    refetchIntervalInBackground: false, // 탭이 백그라운드면 중지
    staleTime: 30000, // 30초간 fresh 상태 유지
  })
}
