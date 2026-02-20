export interface WatchlistItem {
  id: string
  corpCode: string
  corpName: string
  stockCode: string
  market: string | null
  sector: string | null
  createdAt: string
}

export interface WatchlistResponse {
  items: WatchlistItem[]
}

export interface WatchlistCheckResponse {
  isWatchlisted: boolean
}
