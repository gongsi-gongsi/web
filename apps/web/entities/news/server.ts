// 서버 전용 exports

export { getGoogleNews, getMajorMarketNews } from './api/google-news/server'
export {
  formatNewsItem,
  formatRelativeTime,
  deduplicateNews,
  filterNewsByDate,
} from './lib/format-news'
export { prefetchMajorMarketNews } from './queries/prefetch'

export type { NewsItem, NewsResponse } from './model/types'
