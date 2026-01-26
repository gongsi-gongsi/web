import type { Stock as PrismaStock, Market as PrismaMarket } from '@prisma/client'

export type Stock = PrismaStock
export type Market = PrismaMarket

export interface StockListParams {
  market?: Market
  sector?: string
  limit?: number
  offset?: number
}

export interface CreateStockInput {
  symbol: string
  name: string
  market: Market
  sector?: string
}

export interface UpdateStockInput {
  name?: string
  market?: Market
  sector?: string | null
  isActive?: boolean
}
