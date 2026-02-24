/**
 * GA4 커스텀 이벤트 전송 유틸리티
 * window.gtag가 존재할 때만 이벤트를 전송합니다
 */

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

/**
 * GA4 이벤트를 전송합니다
 * @param event - 전송할 이벤트 정보
 */
function sendEvent({ action, category, label, value }: GTagEvent) {
  if (typeof window === 'undefined') return
  if (!('gtag' in window)) return

  const gtag = window.gtag as (...args: unknown[]) => void
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

/** 회원가입 완료 이벤트 */
export function trackSignUp(method: string) {
  sendEvent({ action: 'sign_up', category: 'engagement', label: method })
}

/** 관심종목 추가 이벤트 */
export function trackAddWatchlist(corpName: string) {
  sendEvent({ action: 'add_watchlist', category: 'engagement', label: corpName })
}

/** 관심종목 제거 이벤트 */
export function trackRemoveWatchlist(corpName: string) {
  sendEvent({ action: 'remove_watchlist', category: 'engagement', label: corpName })
}

/** AI 공시 요약 요청 이벤트 */
export function trackAiDisclosureSummary(corpName: string) {
  sendEvent({ action: 'ai_disclosure_summary', category: 'ai_analysis', label: corpName })
}

/** AI 기업 분석 조회 이벤트 */
export function trackAiCompanyAnalysis(corpCode: string) {
  sendEvent({ action: 'ai_company_analysis', category: 'ai_analysis', label: corpCode })
}

/** 검색 이벤트 */
export function trackSearch(query: string) {
  sendEvent({ action: 'search', category: 'engagement', label: query })
}
