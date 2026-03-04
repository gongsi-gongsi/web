import { MobileHeader } from '@/widgets/header'
import { BackButton } from '@/shared/ui/back-button'
import { DisclosureListSkeleton } from '@/widgets/disclosure-list-page'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true">
      <MobileHeader left={<BackButton />} />

      {/* 모바일 버전 */}
      <div className="bg-card pb-24 md:hidden">
        <div className="px-4 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">오늘의 공시</h1>
            <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-1 h-4 w-40 animate-pulse rounded bg-muted" />
        </div>

        <DisclosureListSkeleton />
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-[1280px] py-10 md:block md:px-4 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                오늘의 공시
              </h1>
              <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="mt-1.5 h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <DisclosureListSkeleton />
      </div>
    </main>
  )
}
