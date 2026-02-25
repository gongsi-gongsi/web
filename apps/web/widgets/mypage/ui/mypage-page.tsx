'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  CaretRightIcon,
  HeartIcon,
  SignOutIcon,
  UserCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'

import { Button, Card, Skeleton } from '@gs/ui'

import { useCurrentUser } from '@/entities/user/model/use-current-user'
import { useSignOut } from '@/features/auth'
import { WithdrawDialog } from '@/features/withdraw-account'
import { MobileHeader } from '@/widgets/header'

function LoadingState() {
  return (
    <div className="space-y-6">
      {/* 프로필 카드 스켈레톤 */}
      <Card className="gap-0 overflow-hidden p-0">
        <div className="h-24 rounded-t-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="-mt-10 flex flex-col items-center gap-3 px-6 pb-6">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-5 w-40 rounded-full" />
          </div>
        </div>
      </Card>
      {/* 메뉴 스켈레톤 */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        <Card className="gap-0 overflow-hidden p-0">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function UnauthenticatedState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 rounded-full bg-muted/50 p-6">
        <UserCircleIcon className="size-20 text-muted-foreground" weight="thin" />
      </div>
      <p className="text-xl font-bold">로그인이 필요합니다</p>
      <p className="mt-2 text-sm text-muted-foreground">마이페이지를 이용하려면 로그인해주세요</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/login">로그인하기</Link>
      </Button>
    </div>
  )
}

function ProfileCard({
  name,
  email,
  avatarUrl,
  initial,
}: {
  name: string
  email: string
  avatarUrl: string | null
  initial: string
}) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="h-24 rounded-t-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
      <div className="-mt-10 flex flex-col items-center gap-3 px-6 pb-6">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={80}
            height={80}
            className="size-20 rounded-full border-4 border-background object-cover"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-2xl font-bold text-primary">
            {initial}
          </div>
        )}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xl font-bold">{name}</p>
          <span className="rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">
            {email}
          </span>
        </div>
      </div>
    </Card>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  destructive?: boolean
}

function MenuItem({ icon, label, href, onClick, destructive }: MenuItemProps) {
  const className = `flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50 ${destructive ? 'text-destructive' : ''}`

  const content = (
    <>
      <span className={`rounded-lg p-2 ${destructive ? 'bg-destructive/10' : 'bg-muted/50'}`}>
        {icon}
      </span>
      <span className="flex-1 text-left text-[15px] font-medium">{label}</span>
      <CaretRightIcon
        className={`size-4 ${destructive ? 'text-destructive/50' : 'text-muted-foreground/50'}`}
      />
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
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
            <div className="space-y-4">
              {/* 프로필 */}
              <ProfileCard name={name} email={email} avatarUrl={avatarUrl} initial={initial} />

              {/* 메뉴 */}
              <Card className="gap-0 overflow-hidden py-0">
                <MenuItem
                  icon={<HeartIcon className="size-5 text-muted-foreground" />}
                  label="관심 종목"
                  href="/interests"
                />
                <MenuItem
                  icon={<SignOutIcon className="size-5 text-muted-foreground" />}
                  label="로그아웃"
                  onClick={signOut}
                />
              </Card>

              {/* 회원탈퇴 */}
              <Card className="gap-0 overflow-hidden py-0">
                <MenuItem
                  icon={<WarningIcon className="size-5 text-destructive" />}
                  label="회원탈퇴"
                  onClick={() => setWithdrawOpen(true)}
                  destructive
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* PC 레이아웃 */}
      <div className="mx-auto hidden max-w-2xl py-10 md:block md:px-4 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold md:text-3xl">마이페이지</h1>

        {isLoading ? (
          <LoadingState />
        ) : !user ? (
          <UnauthenticatedState />
        ) : (
          <div className="space-y-8">
            {/* 프로필 */}
            <ProfileCard name={name} email={email} avatarUrl={avatarUrl} initial={initial} />

            {/* 메뉴 */}
            <div>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                메뉴
              </h2>
              <Card className="gap-0 overflow-hidden py-0">
                <MenuItem
                  icon={<HeartIcon className="size-5 text-muted-foreground" />}
                  label="관심 종목"
                  href="/interests"
                />
                <MenuItem
                  icon={<SignOutIcon className="size-5 text-muted-foreground" />}
                  label="로그아웃"
                  onClick={signOut}
                />
              </Card>
            </div>

            {/* 계정 */}
            <div>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                계정
              </h2>
              <Card className="gap-0 overflow-hidden py-0">
                <MenuItem
                  icon={<WarningIcon className="size-5 text-destructive" />}
                  label="회원탈퇴"
                  onClick={() => setWithdrawOpen(true)}
                  destructive
                />
              </Card>
            </div>
          </div>
        )}
      </div>

      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </>
  )
}
