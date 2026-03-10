import { Skeleton } from '@gs/ui'
import { MobileHeader } from '@/widgets/header'

export default function Loading() {
  return (
    <main
      className="mx-auto max-w-lg px-4 py-8 pb-28 md:max-w-2xl md:py-14 md:pb-14"
      aria-busy="true"
    >
      <MobileHeader />

      {/* 타이틀 */}
      <div className="mb-7 flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* 모바일: 리스트 스켈레톤 */}
      <div className="flex flex-col gap-4 md:hidden">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-4 w-4 shrink-0" />
          </div>
        ))}
      </div>

      {/* 데스크탑: 카드 그리드 스켈레톤 */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-3.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton
            key={i}
            className="rounded-3xl"
            style={{ height: 'clamp(280px, 52vw, 380px)' }}
          />
        ))}
      </div>
    </main>
  )
}
