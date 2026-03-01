'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, Card, Badge, Skeleton } from '@gs/ui'
import { ArrowRight, PushPinSimple, CaretLeft, CaretRight } from '@phosphor-icons/react'
import {
  useNotices,
  NOTICE_CATEGORY_LABELS,
  NOTICE_CATEGORY_BADGE_VARIANTS,
  NOTICE_CATEGORY_ACCENT_COLOR,
  NOTICE_CATEGORY_DOT_CLASS,
} from '@/entities/notice'
import type { NoticeListItem } from '@/entities/notice'

function FeaturedNoticeCard({ notice }: { notice: NoticeListItem }) {
  return (
    <Link href={`/notices/${notice.id}`} className="hidden md:block h-full">
      <Card
        interactive
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card px-5 py-5 shadow-none transition-all duration-200 hover:border-border hover:shadow-sm"
      >
        {/* Category accent bar at top */}
        <div
          className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl opacity-80"
          style={{ background: NOTICE_CATEGORY_ACCENT_COLOR[notice.category] }}
        />

        <div className="flex items-center justify-between">
          <Badge variant={NOTICE_CATEGORY_BADGE_VARIANTS[notice.category]}>
            {NOTICE_CATEGORY_LABELS[notice.category]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-3 text-xl font-bold leading-[1.35] text-foreground transition-colors duration-200 group-hover:text-primary">
          {notice.isPinned && (
            <PushPinSimple
              weight="fill"
              className="mr-1.5 inline align-baseline text-primary"
              size={15}
            />
          )}
          {notice.title}
        </h3>

        <p className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-primary">
          자세히 보기{' '}
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </p>
      </Card>
    </Link>
  )
}

function CompactNoticeItem({ notice }: { notice: NoticeListItem }) {
  return (
    <Link
      href={`/notices/${notice.id}`}
      className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50"
    >
      {/* Category dot */}
      <span
        className={cn('mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full', NOTICE_CATEGORY_DOT_CLASS[notice.category])}
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold leading-[1.35] text-foreground transition-colors duration-150 group-hover:text-primary">
          {notice.isPinned && (
            <PushPinSimple weight="fill" className="mr-1 inline align-baseline text-primary" size={12} />
          )}
          {notice.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">{NOTICE_CATEGORY_LABELS[notice.category]}</span>
          {' · '}
          {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
    </Link>
  )
}

function MobileNoticeItem({ notice }: { notice: NoticeListItem }) {
  return (
    <Link href={`/notices/${notice.id}`} className="flex items-start gap-3 px-4 py-3 active:bg-accent/50">
      <span
        className={cn('mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full', NOTICE_CATEGORY_DOT_CLASS[notice.category])}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-primary">{NOTICE_CATEGORY_LABELS[notice.category]}</p>
        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-[1.35] text-foreground">
          {notice.isPinned && (
            <PushPinSimple weight="fill" className="mr-1 inline align-baseline text-primary" size={12} />
          )}
          {notice.title}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
    </Link>
  )
}

function FeaturedLayout({ onShowAll }: { onShowAll: () => void }) {
  const { data } = useNotices({ limit: 5 })

  if (data.data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">공지사항이 없습니다</p>
    )
  }

  const [featured, ...rest] = data.data
  const sideItems = rest.slice(0, 4)
  const hasMore = data.pagination.total > 5

  return (
    <>
      {/* 모바일: 플랫한 리스트 */}
      <div className="divide-y divide-border/50 md:hidden">
        {data.data.map(notice => (
          <MobileNoticeItem key={notice.id} notice={notice} />
        ))}
        {hasMore && (
          <button
            onClick={onShowAll}
            className="flex w-full items-center justify-center gap-1.5 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-accent/50"
          >
            더보기 <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* PC: featured + sidebar */}
      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-[3fr_2fr]">
        <FeaturedNoticeCard notice={featured} />
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">최신 공지</span>
            {hasMore && (
              <button
                onClick={onShowAll}
                className="flex items-center gap-0.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                더보기 <ArrowRight size={12} />
              </button>
            )}
          </div>
          <div className="divide-y divide-border/50">
            {sideItems.map(notice => (
              <CompactNoticeItem key={notice.id} notice={notice} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function AllNoticesList({ onCollapse }: { onCollapse: () => void }) {
  const [page, setPage] = useState(1)
  const { data } = useNotices({ page })

  return (
    <div>
      <button
        onClick={onCollapse}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight size={14} className="rotate-180" />
        접기
      </button>

      {data.data.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">공지사항이 없습니다</p>
      ) : (
        <ul className="divide-y divide-border/50 overflow-hidden rounded-xl border border-border/50">
          {data.data.map(notice => (
            <li key={notice.id}>
              <Link
                href={`/notices/${notice.id}`}
                className="group flex items-start gap-3 px-4 py-4 transition-colors hover:bg-accent/50"
              >
                <Badge
                  variant={NOTICE_CATEGORY_BADGE_VARIANTS[notice.category]}
                  className="mt-0.5 shrink-0 text-xs"
                >
                  {NOTICE_CATEGORY_LABELS[notice.category]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {notice.isPinned && (
                      <PushPinSimple size={13} weight="fill" className="shrink-0 text-primary" />
                    )}
                    <p className="truncate text-sm font-medium transition-colors duration-150 group-hover:text-primary">
                      {notice.title}
                    </p>
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
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            aria-label="이전 페이지"
          >
            <CaretLeft size={15} />
          </button>
          <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
            {page} / {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.pagination.totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            aria-label="다음 페이지"
          >
            <CaretRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

export function NoticeListPage() {
  const [showAll, setShowAll] = useState(false)

  if (showAll) {
    return <AllNoticesList onCollapse={() => setShowAll(false)} />
  }
  return <FeaturedLayout onShowAll={() => setShowAll(true)} />
}

export function NoticeListSkeleton() {
  return (
    <>
      {/* 모바일 */}
      <div className="divide-y divide-border/50 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <Skeleton className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="mt-1.5 h-4 w-full" />
              <Skeleton className="mt-0.5 h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* PC */}
      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-[3fr_2fr]">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card px-5 py-5">
          <Skeleton className="absolute inset-x-0 top-0 h-0.5" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="mt-3 h-6 w-full" />
          <Skeleton className="mt-1.5 h-6 w-4/5" />
          <Skeleton className="mt-1.5 h-6 w-3/5" />
          <div className="mt-auto pt-4">
            <Skeleton className="h-4 w-20" />
          </div>
        </Card>
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-10" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/50 px-4 py-3.5 last:border-0">
              <Skeleton className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-[15px] w-full" />
                <div className="mt-1 flex gap-1.5">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
