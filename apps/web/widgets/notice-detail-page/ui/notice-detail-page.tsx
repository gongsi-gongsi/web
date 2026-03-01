'use client'

import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Badge, Skeleton } from '@gs/ui'
import { ArrowLeft } from '@phosphor-icons/react'
import {
  useNotice,
  NOTICE_CATEGORY_LABELS,
  NOTICE_CATEGORY_BADGE_VARIANTS,
  NOTICE_CATEGORY_ACCENT_COLOR,
} from '@/entities/notice'

interface NoticeDetailPageProps {
  id: string
}

export function NoticeDetailPage({ id }: NoticeDetailPageProps) {
  const { data: notice } = useNotice(id)

  const accentColor = NOTICE_CATEGORY_ACCENT_COLOR[notice.category]
  const badgeVariant = NOTICE_CATEGORY_BADGE_VARIANTS[notice.category]
  const categoryLabel = NOTICE_CATEGORY_LABELS[notice.category]

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
        {/* 카테고리 + 제목 + 날짜 한 줄 */}
        <div className="flex items-start gap-3">
          <Badge
            variant={badgeVariant}
            className="mt-0.5 shrink-0"
            style={
              badgeVariant === 'default'
                ? { backgroundColor: accentColor, borderColor: accentColor }
                : undefined
            }
          >
            {categoryLabel}
          </Badge>
          <h1 className="flex-1 text-lg font-bold leading-[1.4] text-foreground md:text-xl">
            {notice.title}
          </h1>
          <span className="mt-0.5 shrink-0 text-sm text-muted-foreground">
            {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </span>
        </div>

        <div className="mt-4 border-b border-border/60" />
      </header>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-blockquote:text-foreground prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-p:leading-relaxed [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:rounded-lg [&_h2]:bg-muted/60 [&_h2]:px-3 [&_h2]:py-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground"
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
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 h-5 w-14 shrink-0 rounded-full" />
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="mt-0.5 h-4 w-24 shrink-0" />
        </div>
        <Skeleton className="mt-2 h-5 w-3/4" />
        <div className="mt-4 border-b border-border/60" />
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
