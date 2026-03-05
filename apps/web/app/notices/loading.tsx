import { MobileHeader } from '@/widgets/header'
import { NoticeListSkeleton } from '@/widgets/notice-list-page'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0" aria-busy="true">
      <MobileHeader />
      <div className="mx-auto max-w-3xl">
        <div className="px-4 py-5">
          <h1 className="text-xl font-bold">공지사항</h1>
        </div>
        <NoticeListSkeleton />
      </div>
    </main>
  )
}
