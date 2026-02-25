import { Skeleton } from '@gs/ui'

export function DisclosureGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col rounded-2xl border border-border/60 bg-card p-5">
          {/* 상단: 도트 + 공시유형 배지 + 시장 배지 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-5 w-6" />
          </div>

          {/* 회사명 */}
          <Skeleton className="mt-3 h-5 w-28" />

          {/* 종목코드 */}
          <Skeleton className="mt-1 h-3.5 w-16" />

          {/* 공시 제목 2줄 */}
          <div className="mt-2.5 space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          {/* 하단: 날짜 + 제출인 */}
          <div className="mt-auto flex items-center gap-2 pt-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
