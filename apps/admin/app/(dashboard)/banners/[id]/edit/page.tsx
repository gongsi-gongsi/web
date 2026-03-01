'use client'

import { use } from 'react'
import { Skeleton } from '@gs/ui'
import { useBanner } from '@/entities/banner'
import { BannerForm } from '@/features/banner-form'

interface EditBannerPageProps {
  params: Promise<{ id: string }>
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = use(params)
  const { data: banner, isLoading } = useBanner(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    )
  }

  if (!banner) {
    return <div className="text-muted-foreground">배너를 찾을 수 없습니다</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">배너 수정</h1>
      <BannerForm banner={banner} />
    </div>
  )
}
