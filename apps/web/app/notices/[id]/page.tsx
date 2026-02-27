import { Suspense } from 'react'
import type { Metadata } from 'next'
import { HydrationBoundary } from '@tanstack/react-query'
import { MobileHeader } from '@/widgets/header'
import { NoticeDetailPage, NoticeDetailSkeleton } from '@/widgets/notice-detail-page'
import { prefetchNotice, getNotice } from '@/entities/notice'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const notice = await getNotice(id)
    return { title: `${notice.title} | 공시공시` }
  } catch {
    return { title: '공지사항 | 공시공시' }
  }
}

async function NoticeDetailWithPrefetch({ id }: { id: string }) {
  const dehydratedState = await prefetchNotice(id)
  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<NoticeDetailSkeleton />}>
        <NoticeDetailPage id={id} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default async function NoticeDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      <MobileHeader />
      <NoticeDetailWithPrefetch id={id} />
    </main>
  )
}
