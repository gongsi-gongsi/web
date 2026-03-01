'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminQueryKeys } from '@/shared/lib/query-keys'
import { noticeApi } from './api'
import type { CreateNoticeData, UpdateNoticeData } from './types'

interface UseNoticesParams {
  page?: number
  limit?: number
  category?: string
}

export function useNotices(params: UseNoticesParams = {}) {
  return useQuery({
    queryKey: adminQueryKeys.notices.list(params),
    queryFn: () => noticeApi.getAll(params),
  })
}

export function useNotice(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.notices.detail(id),
    queryFn: () => noticeApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateNoticeData) => noticeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.notices.all })
    },
  })
}

export function useUpdateNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoticeData }) =>
      noticeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.notices.all })
    },
  })
}

export function useDeleteNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => noticeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.notices.all })
    },
  })
}
