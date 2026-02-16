// 클라이언트용 exports

export { useCompanyNews, useMajorMarketNews } from './queries/hooks'
export { getNewsByCorpName, getMajorMarketNews } from './api/google-news/client'
export { formatRelativeTime } from './lib/format-news'

export type { NewsItem, NewsResponse } from './model/types'
