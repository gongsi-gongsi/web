'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@gs/ui'
import { ArrowLeft } from '@phosphor-icons/react'
import { UserDetailWidget } from '@/widgets/user-detail'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/users">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">유저 상세</h1>
      </div>
      <UserDetailWidget userId={id} />
    </div>
  )
}
