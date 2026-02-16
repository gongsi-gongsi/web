import { Card, Skeleton } from '@gs/ui'

function MajorNewsCardSkeleton() {
  return (
    <>
      {/* 모바일: 플랫한 리스트 아이템 스켈레톤 */}
      <div className="flex flex-col border-b border-border px-4 py-2.5 md:hidden">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-0.5 h-4 w-4/5" />
        <Skeleton className="mt-1 h-3 w-24" />
      </div>

      {/* PC: 카드형 스켈레톤 */}
      <Card className="hidden h-full flex-col rounded-xl bg-card px-4 py-3.5 md:flex">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="mt-1 h-5 w-3/4" />
        <Skeleton className="mt-2 h-3 w-28" />
      </Card>
    </>
  )
}

export function MajorNewsSkeleton() {
  return (
    <>
      {/* 모바일: 플랫한 리스트 */}
      <div className="md:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <MajorNewsCardSkeleton key={i} />
        ))}
      </div>

      {/* PC: 2열 그리드 */}
      <div className="hidden grid-cols-2 gap-4 md:grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <MajorNewsCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}
