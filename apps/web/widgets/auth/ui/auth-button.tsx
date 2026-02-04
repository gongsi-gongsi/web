'use client'

import Link from 'next/link'

import { Button, Skeleton } from '@ds/ui'

import { useCurrentUser } from '@/entities/user/model/use-current-user'

import { UserMenu } from './user-menu'

export function AuthButton() {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />
  }

  if (!user) {
    return (
      <Button interactive variant="default" size="sm" asChild>
        <Link href="/login">로그인</Link>
      </Button>
    )
  }

  return <UserMenu user={user} />
}
