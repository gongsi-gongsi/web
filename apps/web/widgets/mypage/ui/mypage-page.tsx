'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { HeartIcon, SignOutIcon, UserCircleIcon, WarningIcon } from '@phosphor-icons/react'

import { Button, Card, Separator, Skeleton } from '@gs/ui'

import { useCurrentUser } from '@/entities/user/model/use-current-user'
import { useSignOut } from '@/features/auth'
import { WithdrawDialog } from '@/features/withdraw-account'
import { MobileHeader } from '@/widgets/header'

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  )
}

function UnauthenticatedState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <UserCircleIcon className="mb-4 size-16 text-muted-foreground" weight="thin" />
      <p className="text-lg font-medium">로그인이 필요합니다</p>
      <p className="mt-1 text-sm text-muted-foreground">마이페이지를 이용하려면 로그인해주세요</p>
      <Button asChild className="mt-6">
        <Link href="/login">로그인</Link>
      </Button>
    </div>
  )
}

export function MypagePage() {
  const { user, isLoading } = useCurrentUser()
  const { signOut } = useSignOut()
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? '사용자'
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url ?? null
  const initial = name.charAt(0).toUpperCase()

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
          ) : (
            <div className="space-y-6">
              {/* 프로필 */}
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                    {initial}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              {/* 메뉴 */}
              <Card className="gap-0 overflow-hidden py-0">
                <Link
                  href="/interests"
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <HeartIcon className="size-5 text-muted-foreground" />
                  <span className="text-sm">관심 종목</span>
                </Link>
                <Separator />
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <SignOutIcon className="size-5 text-muted-foreground" />
                  <span className="text-sm">로그아웃</span>
                </button>
              </Card>

              {/* 회원탈퇴 */}
              <Card className="gap-0 overflow-hidden py-0">
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <WarningIcon className="size-5 text-destructive" />
                  <span className="text-sm text-destructive">회원탈퇴</span>
                </button>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* PC 레이아웃 */}
      <div className="mx-auto hidden max-w-2xl py-8 md:block md:px-4 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold md:text-3xl">마이페이지</h1>

        {isLoading ? (
          <LoadingState />
        ) : !user ? (
          <UnauthenticatedState />
        ) : (
          <div className="space-y-8">
            {/* 프로필 */}
            <Card className="p-6">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                    {initial}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>
            </Card>

            {/* 메뉴 */}
            <Card className="gap-0 overflow-hidden py-0">
              <Link
                href="/interests"
                className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
              >
                <HeartIcon className="size-5 text-muted-foreground" />
                <span className="text-sm">관심 종목</span>
              </Link>
              <Separator />
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
              >
                <SignOutIcon className="size-5 text-muted-foreground" />
                <span className="text-sm">로그아웃</span>
              </button>
            </Card>

            {/* 회원탈퇴 */}
            <div>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">계정</h2>
              <Card className="gap-0 overflow-hidden py-0">
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  className="flex w-full items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  <WarningIcon className="size-5 text-destructive" />
                  <span className="text-sm text-destructive">회원탈퇴</span>
                </button>
              </Card>
            </div>
          </div>
        )}
      </div>

      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </>
  )
}
