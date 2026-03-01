'use client'

import { use } from 'react'
import { Skeleton } from '@gs/ui'
import { useNotice } from '@/entities/notice'
import { NoticeForm } from '@/features/notice-form'

interface EditNoticePageProps {
  params: Promise<{ id: string }>
}

export default function EditNoticePage({ params }: EditNoticePageProps) {
  const { id } = use(params)
  const { data: notice, isLoading } = useNotice(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    )
  }

  if (!notice) {
    return <div className="text-muted-foreground">공지사항을 찾을 수 없습니다</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">공지사항 수정</h1>
      <NoticeForm notice={notice} />
    </div>
  )
}
