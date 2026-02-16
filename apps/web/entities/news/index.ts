// 클라이언트용 exports

export { useCompanyNews } from './queries/hooks'
export { getNewsByCorpName } from './api/google-news/client'
export { formatRelativeTime } from './lib/format-news'

export type { NewsItem, NewsResponse } from './model/types'
