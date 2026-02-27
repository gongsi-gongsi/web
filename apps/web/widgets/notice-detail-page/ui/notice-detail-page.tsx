'use client'

import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Badge, Skeleton } from '@gs/ui'
import { ArrowLeft, CalendarBlank, User } from '@phosphor-icons/react'
import { useNotice, NOTICE_CATEGORY_LABELS } from '@/entities/notice'
import type { NoticeCategory } from '@/entities/notice'

interface NoticeDetailPageProps {
  id: string
}

/** 카테고리별 헤더 액센트 컬러 (CSS variable) */
const CATEGORY_ACCENT_COLOR: Record<NoticeCategory, string> = {
  NOTICE: 'var(--primary)',
  UPDATE: 'var(--color-secondary-500)',
  EVENT: 'var(--success)',
  MAINTENANCE: 'var(--destructive)',
}

const CATEGORY_BADGE_VARIANTS: Record<
  NoticeCategory,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  NOTICE: 'default',
  UPDATE: 'secondary',
  EVENT: 'outline',
  MAINTENANCE: 'destructive',
}

export function NoticeDetailPage({ id }: NoticeDetailPageProps) {
  const { data: notice } = useNotice(id)

  return (
    <article className="mx-auto max-w-3xl px-4 py-6">
      {/* Back link */}
      <Link
        href="/notices"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        공지사항 목록
      </Link>

      {/* Header */}
      <header className="mb-8">
        {/* Category accent bar */}
        <div
          className="mb-5 h-0.5 w-12 rounded-full opacity-80"
          style={{ background: CATEGORY_ACCENT_COLOR[notice.category] }}
        />

        <div className="mb-3 flex items-center gap-2">
          <Badge variant={CATEGORY_BADGE_VARIANTS[notice.category]}>
            {NOTICE_CATEGORY_LABELS[notice.category]}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold leading-[1.35] text-foreground md:text-3xl">
          {notice.title}
        </h1>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-border/60 pb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User size={14} className="shrink-0" />
            {notice.author.name}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarBlank size={14} className="shrink-0" />
            {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-blockquote:text-foreground prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notice.content) }}
      />

      {/* Footer nav */}
      <div className="mt-12 border-t border-border/60 pt-6">
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} />
          목록으로 돌아가기
        </Link>
      </div>
    </article>
  )
}

export function NoticeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Skeleton className="mb-8 h-5 w-28" />

      <div className="mb-8">
        <Skeleton className="mb-5 h-0.5 w-12 rounded-full" />
        <Skeleton className="mb-3 h-5 w-16 rounded-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="mt-1.5 h-8 w-3/4" />
        <div className="mt-4 flex gap-4 border-b border-border/60 pb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="space-y-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`b-${i}`} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
