import type { Market, TodayDisclosuresResponse } from '../model/types'

/**
 * 서버/클라이언트 환경에 따라 적절한 base URL을 반환합니다
 * @returns 클라이언트에서는 window.location.origin, 서버에서는 환경 변수 또는 localhost
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // 클라이언트에서는 현재 origin 사용
    return window.location.origin
  }
  // 서버에서는 환경 변수 또는 기본값 사용
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

/**
 * 오늘의 공시 목록을 조회합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex)
 * @returns 공시 목록과 메타데이터
 * @throws {Error} API 호출 실패 시
 */
export async function getTodayDisclosures(
  market: Market = 'all'
): Promise<TodayDisclosuresResponse> {
  const params = new URLSearchParams({ market })
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/disclosures/today?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch today disclosures')
  }

  return response.json()
}
