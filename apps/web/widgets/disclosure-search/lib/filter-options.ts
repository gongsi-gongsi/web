import type { SearchPeriod, Market, DisclosureType } from '@/entities/disclosure'

export const PERIOD_OPTIONS: { value: SearchPeriod; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: '1w', label: '1주일' },
  { value: '3m', label: '3개월' },
  { value: 'all', label: '전체' },
]

export const MARKET_OPTIONS: { value: Market; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'kospi', label: '코스피' },
  { value: 'kosdaq', label: '코스닥' },
  { value: 'konex', label: '코넥스' },
]

export const TYPE_OPTIONS: { value: DisclosureType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'A', label: '정기공시' },
  { value: 'B', label: '주요사항보고' },
  { value: 'C', label: '발행공시' },
  { value: 'D', label: '지분공시' },
  { value: 'E', label: '기타공시' },
  { value: 'F', label: '외부감사관련' },
  { value: 'G', label: '펀드공시' },
  { value: 'H', label: '자산유동화' },
  { value: 'I', label: '거래소공시' },
  { value: 'J', label: '공정위공시' },
]

/**
 * SearchPeriod 값을 한글 라벨로 변환합니다
 * @param period - 검색 기간 값
 * @returns 한글 라벨
 */
export function getPeriodLabel(period: SearchPeriod): string {
  const option = PERIOD_OPTIONS.find(o => o.value === period)
  if (option) return option.label
  if (period === 'custom') return '직접입력'
  return period
}

/**
 * Market 값을 한글 라벨로 변환합니다
 * @param market - 시장 구분 값
 * @returns 한글 라벨
 */
export function getMarketLabel(market: Market): string {
  const option = MARKET_OPTIONS.find(o => o.value === market)
  if (option) return option.label
  if (market === 'etc') return '기타'
  return market
}
