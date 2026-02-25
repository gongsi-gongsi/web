import { Skeleton } from '@gs/ui'

function PopularCompanyCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-muted/50 p-4">
      {/* 순위 */}
      <Skeleton className="h-8 w-6 rounded" />

      {/* 회사명 + 종목코드 */}
      <div className="mt-3 flex flex-col gap-1">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}

export function PopularCompanySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4">
      {[1, 2, 3].map(i => (
        <PopularCompanyCardSkeleton key={i} />
      ))}
      {[4, 5].map(i => (
        <div key={i} className="hidden md:block">
          <PopularCompanyCardSkeleton />
        </div>
      ))}
    </div>
  )
}
