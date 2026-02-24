'use client'

import Link from 'next/link'

import { HeartIcon, LockKeyIcon } from '@phosphor-icons/react'

import { Badge, Button, Card, Skeleton } from '@gs/ui'

import { useCurrentUser } from '@/entities/user/model/use-current-user'
import { useWatchlist, useRemoveFromWatchlist } from '@/entities/watchlist'
import type { WatchlistItem } from '@/entities/watchlist'
import { MobileHeader } from '@/widgets/header'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d} 등록`
}

function WatchlistCardSkeleton() {
  return (
    <Card className="gap-3 rounded-lg py-4">
      <div className="px-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </Card>
  )
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <WatchlistCardSkeleton key={i} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <HeartIcon className="mb-4 size-16 text-muted-foreground" weight="thin" />
      <p className="text-lg font-medium">아직 관심 종목이 없습니다</p>
      <p className="mt-1 text-sm text-muted-foreground">
        기업 상세 페이지에서 관심 종목을 추가해보세요
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/">홈으로 이동</Link>
      </Button>
    </div>
  )
}

function UnauthenticatedState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <LockKeyIcon className="mb-4 size-16 text-muted-foreground" weight="thin" />
      <p className="text-lg font-medium">로그인이 필요합니다</p>
      <p className="mt-1 text-sm text-muted-foreground">관심 종목을 등록하려면 로그인해주세요</p>
      <Button asChild className="mt-6">
        <Link href="/login">로그인</Link>
      </Button>
    </div>
  )
}

interface WatchlistCardProps {
  item: WatchlistItem
  onRemove: (corpCode: string) => void
  isRemoving: boolean
}

function WatchlistCard({ item, onRemove, isRemoving }: WatchlistCardProps) {
  return (
    <Card className="group relative gap-0 rounded-lg py-0 transition-shadow hover:shadow-sm">
      <Link
        href={`/companies/${item.corpCode}`}
        className="block p-4"
        aria-label={`${item.corpName} 기업 상세 보기`}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{item.corpName}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{item.stockCode}</p>
          </div>
          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onRemove(item.corpCode)
            }}
            disabled={isRemoving}
            className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/30"
            aria-label={`${item.corpName} 관심 해제`}
          >
            <HeartIcon className="size-5" weight="fill" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {item.market ? (
            <Badge variant="secondary" className="text-xs">
              {item.market}
            </Badge>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
        </div>
      </Link>
    </Card>
  )
}

export function InterestsPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { data, isLoading: isWatchlistLoading } = useWatchlist()
  const {
    mutate: removeFromWatchlist,
    isPending,
    variables: removingCorpCode,
  } = useRemoveFromWatchlist()

  const isLoading = isUserLoading || (!!user && isWatchlistLoading)
  const items = data?.items ?? []

  return (
    <>
      {/* 모바일 헤더 */}
      <MobileHeader />

      {/* 모바일 레이아웃 */}
      <div className="min-h-screen bg-background pb-24 md:hidden">
        <div className="px-4 pt-4">
          {isLoading ? (
            <LoadingState />
          ) : !user ? (
            <UnauthenticatedState />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {items.map(item => (
                <WatchlistCard
                  key={item.id}
                  item={item}
                  onRemove={removeFromWatchlist}
                  isRemoving={isPending && removingCorpCode === item.corpCode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PC 레이아웃 */}
      <div className="mx-auto hidden max-w-7xl py-8 md:block md:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">관심 종목</h1>
          <p className="mt-2 text-sm text-muted-foreground">내가 등록한 관심 종목 목록입니다</p>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !user ? (
          <UnauthenticatedState />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <WatchlistCard
                key={item.id}
                item={item}
                onRemove={removeFromWatchlist}
                isRemoving={isPending && removingCorpCode === item.corpCode}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
