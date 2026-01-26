import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stockQueries, stockKeys } from './queries'
import { createStock, createStocksBatch, deleteStock } from '../api/actions'
import type { StockListParams, CreateStockInput } from '../types'

// Query Hooks
export function useStocks(params?: StockListParams) {
  return useQuery(stockQueries.list(params))
}

export function useStock(symbol: string) {
  return useQuery(stockQueries.detail(symbol))
}

export function useStockSearch(query: string) {
  return useQuery(stockQueries.search(query))
}

// Mutation Hooks
export function useCreateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateStockInput) => {
      const result = await createStock(input)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() })
    },
  })
}

export function useCreateStocksBatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inputs: CreateStockInput[]) => {
      const result = await createStocksBatch(inputs)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
    },
  })
}

export function useDeleteStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (symbol: string) => {
      const result = await deleteStock(symbol)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() })
    },
  })
}
