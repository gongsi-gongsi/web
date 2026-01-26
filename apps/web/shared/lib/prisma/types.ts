import type { Prisma } from '@prisma/client'

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface SortParams<T extends string = string> {
  sortBy?: T
  sortOrder?: 'asc' | 'desc'
}

export type TransactionClient = Prisma.TransactionClient

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}
