'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge, Skeleton } from '@gs/ui'
import { PushPinSimple } from '@phosphor-icons/react'
import { useNotices, NOTICE_CATEGORY_LABELS } from '@/entities/notice'
import type { NoticeCategory } from '@/entities/notice'

const CATEGORY_BADGE_VARIANTS: Record<
  NoticeCategory,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  NOTICE: 'default',
  UPDATE: 'secondary',
  EVENT: 'outline',
  MAINTENANCE: 'destructive',
}

export function NoticeListPage() {
  const [page, setPage] = useState(1)
  const { data } = useNotices({ page })

  return (
    <div>
      {data.data.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">공지사항이 없습니다</p>
      ) : (
        <ul className="divide-y divide-border">
          {data.data.map(notice => (
            <li key={notice.id}>
              <Link
                href={`/notices/${notice.id}`}
                className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted/50"
              >
                <Badge
                  variant={CATEGORY_BADGE_VARIANTS[notice.category]}
                  className="mt-0.5 shrink-0 text-xs"
                >
                  {NOTICE_CATEGORY_LABELS[notice.category]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {notice.isPinned && (
                      <PushPinSimple size={14} weight="fill" className="shrink-0 text-primary" />
                    )}
                    <p className="truncate text-sm font-medium">{notice.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-border py-4">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.pagination.totalPages}
            className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

export function NoticeListSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-4">
          <Skeleton className="mt-0.5 h-5 w-14 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
