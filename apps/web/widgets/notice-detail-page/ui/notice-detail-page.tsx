'use client'

import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Badge, Skeleton } from '@gs/ui'
import { ArrowLeft } from '@phosphor-icons/react'
import { useNotice, NOTICE_CATEGORY_LABELS } from '@/entities/notice'

interface NoticeDetailPageProps {
  id: string
}

export function NoticeDetailPage({ id }: NoticeDetailPageProps) {
  const { data: notice } = useNotice(id)

  return (
    <article className="mx-auto max-w-3xl px-4 py-6">
      <Link
        href="/notices"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <header className="mb-6 border-b border-border pb-4">
        <div className="mb-3">
          <Badge variant="secondary">{NOTICE_CATEGORY_LABELS[notice.category]}</Badge>
        </div>
        <h1 className="text-xl font-bold md:text-2xl">{notice.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{notice.author.name}</span>
          <span>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>
      </header>

      <div
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notice.content) }}
      />
    </article>
  )
}

export function NoticeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Skeleton className="mb-6 h-5 w-20" />
      <div className="mb-6 border-b border-border pb-4">
        <Skeleton className="mb-3 h-5 w-16 rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
