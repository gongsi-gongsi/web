import { Suspense } from 'react'
import type { Metadata } from 'next'
import { HydrationBoundary } from '@tanstack/react-query'
import { MobileHeader } from '@/widgets/header'
import { NoticeListPage, NoticeListSkeleton } from '@/widgets/notice-list-page'
import { prefetchNotices } from '@/entities/notice'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '공지사항 | 공시공시',
  description: '공시공시 서비스 공지사항, 업데이트, 이벤트 안내',
}

async function NoticeListWithPrefetch() {
  const dehydratedState = await prefetchNotices()
  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<NoticeListSkeleton />}>
        <NoticeListPage />
      </Suspense>
    </HydrationBoundary>
  )
}

export default function NoticesPage() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      <MobileHeader />
      <div className="mx-auto max-w-3xl">
        <div className="px-4 py-5">
          <h1 className="text-xl font-bold">공지사항</h1>
        </div>
        <NoticeListWithPrefetch />
      </div>
    </main>
  )
}
