import { parseStringPromise } from 'xml2js'

import { formatNewsItem, deduplicateNews, filterNewsByDate } from '../../lib/format-news'
import type { NewsResponse, NewsItem } from '../../model/types'

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

  // 10초 타임아웃 설정
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(rssUrl.toString(), {
      signal: controller.signal,
      next: {
        revalidate: 300, // 5분 캐시
        tags: ['news', query],
      },
    })

    clearTimeout(timeoutId)

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
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Google News RSS timeout: ${query}`)
    }
    throw error
  }
}

/**
 * [서버 전용] 한국 주식 시장의 주요 뉴스를 조회합니다
 * 5개 테마 키워드로 검색 → 병합 → 중복제거 → 날짜필터 → 정렬
 * @param limit - 최대 반환 건수 (기본값: 6)
 * @param hoursBack - 필터링할 시간 범위 (기본값: 48시간)
 * @returns 주요 뉴스 목록
 * @example
 * const news = await getMajorMarketNews(6, 48)
 */
export async function getMajorMarketNews(
  limit: number = 6,
  hoursBack: number = 48
): Promise<NewsResponse> {
  const keywords = ['코스피', '코스닥', '증시', '금리', '환율']
  const itemsPerKeyword = 20

  // 병렬로 뉴스 조회 (실패 허용)
  const results = await Promise.allSettled(
    keywords.map(keyword => getGoogleNews(`${keyword} when:2d`, itemsPerKeyword))
  )

  // 성공한 결과만 수집
  const allItems: NewsItem[] = results
    .filter(
      (result): result is PromiseFulfilledResult<NewsResponse> => result.status === 'fulfilled'
    )
    .flatMap(result => result.value.items)

  // 중복 제거 → 날짜 필터 → 최신순 정렬 → limit 적용
  const uniqueItems = deduplicateNews(allItems)
  const filteredItems = filterNewsByDate(uniqueItems, hoursBack)
  const sortedItems = filteredItems.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  })

  return {
    items: sortedItems.slice(0, limit),
    query: '주요 시장 뉴스',
    fetchedAt: new Date().toISOString(),
  }
}
