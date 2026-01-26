import 'server-only'

import { prisma } from '@/shared/lib/prisma'
import type { StockListParams, Stock } from '../types'

export async function getStocks(params?: StockListParams): Promise<Stock[]> {
  const { market, sector, limit = 50, offset = 0 } = params ?? {}

  return prisma.stock.findMany({
    where: {
      isActive: true,
      ...(market && { market }),
      ...(sector && { sector }),
    },
    orderBy: { name: 'asc' },
    take: limit,
    skip: offset,
  })
}

export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
  return prisma.stock.findUnique({
    where: { symbol },
  })
}

export async function searchStocks(query: string): Promise<Stock[]> {
  if (query.length < 2) {
    return []
  }

  return prisma.stock.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { symbol: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
    take: 20,
  })
}

export async function getStocksCount(params?: StockListParams): Promise<number> {
  const { market, sector } = params ?? {}

  return prisma.stock.count({
    where: {
      isActive: true,
      ...(market && { market }),
      ...(sector && { sector }),
    },
  })
}
