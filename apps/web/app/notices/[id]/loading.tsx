import { MobileHeader } from '@/widgets/header'
import { NoticeDetailSkeleton } from '@/widgets/notice-detail-page'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0" aria-busy="true">
      <MobileHeader />
      <NoticeDetailSkeleton />
    </main>
  )
}
