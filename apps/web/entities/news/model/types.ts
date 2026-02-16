export interface NewsItem {
  /** 뉴스 제목 */
  title: string
  /** Google News 리다이렉트 링크 */
  link: string
  /** 게시 시간 (ISO 8601) */
  pubDate: string
  /** 매체명 (예: 한국경제) */
  source: string
  /** 매체 URL */
  sourceUrl: string
}

export interface NewsResponse {
  /** 뉴스 항목 목록 */
  items: NewsItem[]
  /** 검색 쿼리 */
  query: string
  /** 조회 시간 (ISO 8601) */
  fetchedAt: string
}
