'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminQueryKeys } from '@/shared/lib/query-keys'
import { userApi } from './api'
import type { UpdateUserData } from './types'

interface UseUsersParams {
  page?: number
  limit?: number
  search?: string
}

export function useUsers(params: UseUsersParams = {}) {
  return useQuery({
    queryKey: adminQueryKeys.users.list(params),
    queryFn: () => userApi.getAll(params),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.users.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
    },
  })
}

export function useUserWatchlist(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.users.watchlist(id),
    queryFn: () => userApi.getWatchlist(id),
    enabled: !!id,
  })
}
