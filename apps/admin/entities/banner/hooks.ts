'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminQueryKeys } from '@/shared/lib/query-keys'
import { bannerApi } from './api'
import type { CreateBannerData, UpdateBannerData } from './types'

export function useBanners() {
  return useQuery({
    queryKey: adminQueryKeys.banners.all,
    queryFn: bannerApi.getAll,
  })
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.banners.detail(id),
    queryFn: () => bannerApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBannerData) => bannerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners.all })
    },
  })
}

export function useUpdateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerData }) =>
      bannerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners.all })
    },
  })
}

export function useDeleteBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bannerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners.all })
    },
  })
}

export function useReorderBanners() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderedIds: string[]) => bannerApi.reorder(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners.all })
    },
  })
}
