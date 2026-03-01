'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queries } from '@/shared/lib/query-keys'
import { getWatchlist, addToWatchlist, removeFromWatchlist, checkWatchlist } from '../api'
import type { WatchlistCheckResponse, WatchlistItem, WatchlistResponse } from '../model'

/**
 * [클라이언트 전용] 관심 종목 목록을 조회합니다
 * @returns TanStack Query 결과 (data: WatchlistResponse)
 * @example
 * ```tsx
 * function WatchlistPage() {
 *   const { data, isLoading } = useWatchlist()
 *   return <div>{data?.items.map(...)}</div>
 * }
 * ```
 */
export function useWatchlist() {
  return useQuery({
    queryKey: queries.watchlist.all.queryKey,
    queryFn: () => getWatchlist(),
  })
}

/**
 * [클라이언트 전용] 특정 기업의 관심 종목 등록 여부를 확인합니다
 * 비로그인 상태에서도 동작하며, API 에러 시 isWatchlisted: false로 처리됩니다
 * @param corpCode - 기업 고유번호 (8자리)
 * @returns TanStack Query 결과 (data: WatchlistCheckResponse)
 * @example
 * ```tsx
 * function WatchlistButton({ corpCode }: { corpCode: string }) {
 *   const { data } = useWatchlistCheck(corpCode)
 *   return <button>{data?.isWatchlisted ? '관심 해제' : '관심 등록'}</button>
 * }
 * ```
 */
export function useWatchlistCheck(corpCode: string) {
  return useQuery({
    queryKey: queries.watchlist.check(corpCode).queryKey,
    queryFn: () => checkWatchlist(corpCode),
    retry: false,
  })
}

/**
 * [클라이언트 전용] 관심 종목에 기업을 추가하는 mutation 훅
 * 낙관적 업데이트로 즉시 UI를 반영하고, 실패 시 이전 상태로 롤백합니다
 * @returns useMutation 결과 (mutate: (corpCode: string) => void)
 * @example
 * ```tsx
 * function AddButton({ corpCode }: { corpCode: string }) {
 *   const { mutate, isPending } = useAddToWatchlist()
 *   return <button onClick={() => mutate(corpCode)} disabled={isPending}>추가</button>
 * }
 * ```
 */
export function useAddToWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (corpCode: string) => addToWatchlist(corpCode),
    onMutate: async corpCode => {
      const checkQueryKey = queries.watchlist.check(corpCode).queryKey
      const allQueryKey = queries.watchlist.all.queryKey

      await queryClient.cancelQueries({ queryKey: checkQueryKey })
      await queryClient.cancelQueries({ queryKey: allQueryKey })

      const previousCheck = queryClient.getQueryData<WatchlistCheckResponse>(checkQueryKey)
      const previousAll = queryClient.getQueryData<WatchlistResponse>(allQueryKey)

      queryClient.setQueryData<WatchlistCheckResponse>(checkQueryKey, { isWatchlisted: true })

      return { previousCheck, previousAll }
    },
    onSuccess: (newItem: WatchlistItem) => {
      // API가 반환한 실제 아이템으로 캐시를 즉시 업데이트합니다.
      // 관심 페이지로 이동해도 refetch 없이 바로 반영됩니다.
      queryClient.setQueryData<WatchlistResponse>(queries.watchlist.all.queryKey, old =>
        old ? { items: [...old.items, newItem] } : { items: [newItem] }
      )
    },
    onError: (_error, corpCode, context) => {
      if (context?.previousCheck !== undefined) {
        queryClient.setQueryData(queries.watchlist.check(corpCode).queryKey, context.previousCheck)
      }
      if (context?.previousAll !== undefined) {
        queryClient.setQueryData(queries.watchlist.all.queryKey, context.previousAll)
      }
    },
    onSettled: (_data, _error, corpCode) => {
      queryClient.invalidateQueries({ queryKey: queries.watchlist.check(corpCode).queryKey })
      queryClient.invalidateQueries({ queryKey: queries.watchlist.all.queryKey })
    },
  })
}

/**
 * [클라이언트 전용] 관심 종목에서 기업을 삭제하는 mutation 훅
 * 낙관적 업데이트로 즉시 UI를 반영하고, 실패 시 이전 상태로 롤백합니다
 * @returns useMutation 결과 (mutate: (corpCode: string) => void)
 * @example
 * ```tsx
 * function RemoveButton({ corpCode }: { corpCode: string }) {
 *   const { mutate, isPending } = useRemoveFromWatchlist()
 *   return <button onClick={() => mutate(corpCode)} disabled={isPending}>삭제</button>
 * }
 * ```
 */
export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (corpCode: string) => removeFromWatchlist(corpCode),
    onMutate: async corpCode => {
      const checkQueryKey = queries.watchlist.check(corpCode).queryKey
      const allQueryKey = queries.watchlist.all.queryKey

      await queryClient.cancelQueries({ queryKey: checkQueryKey })
      await queryClient.cancelQueries({ queryKey: allQueryKey })

      const previousCheck = queryClient.getQueryData<WatchlistCheckResponse>(checkQueryKey)
      const previousAll = queryClient.getQueryData<WatchlistResponse>(allQueryKey)

      queryClient.setQueryData<WatchlistCheckResponse>(checkQueryKey, { isWatchlisted: false })

      if (previousAll) {
        queryClient.setQueryData<WatchlistResponse>(allQueryKey, {
          items: previousAll.items.filter(item => item.corpCode !== corpCode),
        })
      }

      return { previousCheck, previousAll }
    },
    onError: (_error, corpCode, context) => {
      if (context?.previousCheck !== undefined) {
        queryClient.setQueryData(queries.watchlist.check(corpCode).queryKey, context.previousCheck)
      }
      if (context?.previousAll !== undefined) {
        queryClient.setQueryData(queries.watchlist.all.queryKey, context.previousAll)
      }
    },
    onSettled: (_data, _error, corpCode) => {
      queryClient.invalidateQueries({ queryKey: queries.watchlist.check(corpCode).queryKey })
      queryClient.invalidateQueries({ queryKey: queries.watchlist.all.queryKey })
    },
  })
}
