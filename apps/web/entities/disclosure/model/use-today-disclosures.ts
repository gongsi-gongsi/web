import { useSuspenseQuery } from '@tanstack/react-query'

import { queries } from '@/shared/lib/query-keys'

import { getTodayDisclosures } from '../api/get-today-disclosures'
import type { Market } from './types'

/**
 * 오늘의 공시 목록을 조회하고 1분마다 자동으로 갱신합니다
 * @param market - 시장 구분 (기본값: 'all')
 * @returns Suspense 기반 쿼리 결과
 */
export function useTodayDisclosures(market: Market = 'all') {
  return useSuspenseQuery({
    ...queries.disclosures.today(market),
    queryFn: () => getTodayDisclosures(market),
    refetchInterval: 60000, // 1분마다 자동 refetch
    refetchIntervalInBackground: false, // 탭이 백그라운드면 중지
    staleTime: 60000, // 1분간 fresh 상태 유지
  })
}
