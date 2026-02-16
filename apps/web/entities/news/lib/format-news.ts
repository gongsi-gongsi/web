import type { NewsItem } from '../model/types'

interface RssItem {
  title?: string[]
  link?: string[]
  pubDate?: string[]
  source?: Array<{ _: string; $: { url: string } }>
}

/**
 * Google News RSS title에서 " - 매체명" 접미사를 제거합니다
 * @param rawTitle - RSS 원본 제목 (예: "삼성전자 주가 급등 - 한국경제")
 * @returns 매체명이 제거된 제목
 */
function stripSourceFromTitle(rawTitle: string): string {
  const lastDash = rawTitle.lastIndexOf(' - ')
  if (lastDash === -1) return rawTitle
  return rawTitle.slice(0, lastDash)
}

/**
 * RSS XML 파싱 결과를 NewsItem으로 변환합니다
 * @param item - xml2js로 파싱된 RSS item 객체
 * @returns 변환된 NewsItem
 */
export function formatNewsItem(item: RssItem): NewsItem {
  const rawTitle = item.title?.[0] ?? ''

  return {
    title: stripSourceFromTitle(rawTitle),
    link: item.link?.[0] ?? '',
    pubDate: item.pubDate?.[0] ? new Date(item.pubDate[0]).toISOString() : new Date().toISOString(),
    source: item.source?.[0]?._ ?? '',
    sourceUrl: item.source?.[0]?.$?.url ?? '',
  }
}

/**
 * 날짜를 상대 시간 문자열로 변환합니다
 * @param dateString - ISO 8601 날짜 문자열
 * @returns 상대 시간 문자열 (예: "5분 전", "2시간 전")
 */
export function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diff = now - date

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`

  return new Date(dateString).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 뉴스 목록에서 중복을 제거합니다 (link 기준)
 * @param items - 뉴스 항목 배열
 * @returns 중복이 제거된 뉴스 항목 배열
 * @example
 * const news = [
 *   { title: 'A', link: 'https://example.com/1', ... },
 *   { title: 'B', link: 'https://example.com/1', ... }, // 중복
 *   { title: 'C', link: 'https://example.com/2', ... },
 * ]
 * deduplicateNews(news) // [첫 번째, 세 번째만 반환]
 */
export function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>()
  return items.filter(item => {
    if (seen.has(item.link)) {
      return false
    }
    seen.add(item.link)
    return true
  })
}

/**
 * 특정 기간 내의 뉴스만 필터링합니다
 * @param items - 뉴스 항목 배열
 * @param hours - 현재 시점으로부터 몇 시간 이내인지 (기본값: 48시간)
 * @returns 필터링된 뉴스 항목 배열
 * @example
 * filterNewsByDate(news, 24) // 최근 24시간 이내 뉴스만 반환
 * filterNewsByDate(news) // 최근 48시간 이내 뉴스만 반환
 */
export function filterNewsByDate(items: NewsItem[], hours: number = 48): NewsItem[] {
  const now = Date.now()
  const cutoff = now - hours * 60 * 60 * 1000

  return items.filter(item => {
    const pubDate = new Date(item.pubDate).getTime()
    return pubDate >= cutoff
  })
}
