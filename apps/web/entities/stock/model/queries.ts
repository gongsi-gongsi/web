import { queryOptions } from '@tanstack/react-query'
import { getStocks, getStockBySymbol, searchStocks } from '../api/queries'
import type { StockListParams } from '../types'

export const stockKeys = {
  all: ['stocks'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (params?: StockListParams) => [...stockKeys.lists(), params] as const,
  details: () => [...stockKeys.all, 'detail'] as const,
  detail: (symbol: string) => [...stockKeys.details(), symbol] as const,
  search: (query: string) => [...stockKeys.all, 'search', query] as const,
}

export const stockQueries = {
  list: (params?: StockListParams) =>
    queryOptions({
      queryKey: stockKeys.list(params),
      queryFn: () => getStocks(params),
      staleTime: 5 * 60 * 1000, // 5분
    }),

  detail: (symbol: string) =>
    queryOptions({
      queryKey: stockKeys.detail(symbol),
      queryFn: () => getStockBySymbol(symbol),
      staleTime: 5 * 60 * 1000,
      enabled: !!symbol,
    }),

  search: (query: string) =>
    queryOptions({
      queryKey: stockKeys.search(query),
      queryFn: () => searchStocks(query),
      staleTime: 30 * 1000, // 30초
      enabled: query.length >= 2,
    }),
}
