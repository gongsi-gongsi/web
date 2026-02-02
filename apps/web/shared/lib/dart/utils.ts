import type { Market } from '@/entities/disclosure'

/**
 * DART API 키를 환경변수에서 가져옵니다
 * @returns DART API 키
 * @throws 환경변수가 설정되지 않은 경우 에러
 */
export function getDartApiKey(): string {
  const apiKey = process.env.DART_API_KEY
  if (!apiKey) {
    throw new Error('DART_API_KEY is not defined in environment variables')
  }
  return apiKey
}

/**
 * 시장 구분을 DART API의 corp_cls 파라미터 값으로 변환합니다
 * @param market - 시장 구분 (all | kospi | kosdaq | konex | etc)
 * @returns DART API corp_cls 값 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타, null: 전체)
 */
export function getCorpClsFromMarket(market: Market): string | null {
  switch (market) {
    case 'all':
      return null
    case 'kospi':
      return 'Y'
    case 'kosdaq':
      return 'K'
    case 'konex':
      return 'N'
    case 'etc':
      return 'E'
    default:
      return null
  }
}

/**
 * 날짜를 YYYYMMDD 형식의 문자열로 변환합니다
 * @param date - 변환할 날짜 객체
 * @returns YYYYMMDD 형식의 날짜 문자열
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
