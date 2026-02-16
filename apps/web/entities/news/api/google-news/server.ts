import { parseStringPromise } from 'xml2js'

import { formatNewsItem } from '../../lib/format-news'
import type { NewsResponse } from '../../model/types'

/**
 * [서버 전용] Google News RSS에서 뉴스를 조회합니다
 * @param query - 검색 쿼리 (기업명)
 * @param limit - 최대 조회 건수 (기본값: 10)
 * @returns 뉴스 목록
 * @throws {Error} RSS fetch 또는 파싱 실패 시
 */
export async function getGoogleNews(query: string, limit: number = 10): Promise<NewsResponse> {
  const rssUrl = new URL('https://news.google.com/rss/search')
  rssUrl.searchParams.append('q', query)
  rssUrl.searchParams.append('hl', 'ko')
  rssUrl.searchParams.append('gl', 'KR')
  rssUrl.searchParams.append('ceid', 'KR:ko')

  const response = await fetch(rssUrl.toString(), {
    next: {
      revalidate: 300, // 5분 캐시
      tags: ['news', query],
    },
  })

  if (!response.ok) {
    throw new Error(`Google News RSS error: ${response.status}`)
  }

  const xmlText = await response.text()
  const parsed = await parseStringPromise(xmlText)
  const rawItems = parsed?.rss?.channel?.[0]?.item ?? []

  const items = rawItems.slice(0, limit).map(formatNewsItem)

  return {
    items,
    query,
    fetchedAt: new Date().toISOString(),
  }
}
