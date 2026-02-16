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
