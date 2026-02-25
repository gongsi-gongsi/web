import { Card, Skeleton } from '@gs/ui'

function MobileItemSkeleton() {
  return (
    <div className="flex flex-col px-4 py-3 md:hidden">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-1.5 h-4 w-full" />
      <Skeleton className="mt-0.5 h-4 w-4/5" />
    </div>
  )
}

function FeaturedCardSkeleton() {
  return (
    <Card className="hidden h-full flex-col rounded-xl border border-border/50 bg-card px-5 py-5 md:flex">
      <Skeleton className="h-5 w-16 rounded-md" />
      <Skeleton className="mt-3 h-6 w-full" />
      <Skeleton className="mt-1.5 h-6 w-4/5" />
      <Skeleton className="mt-1.5 h-6 w-3/5" />
      <div className="mt-auto pt-3">
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  )
}

function CompactItemSkeleton() {
  return (
    <div className="px-4 py-3.5">
      <Skeleton className="h-5 w-full" />
      <div className="mt-1 flex items-center gap-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

export function MajorNewsSkeleton() {
  return (
    <>
      {/* 모바일: 플랫한 리스트 */}
      <div className="divide-y divide-border/50 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <MobileItemSkeleton key={i} />
        ))}
      </div>

      {/* PC: Feature Article + Sidebar */}
      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-[3fr_2fr]">
        <FeaturedCardSkeleton />
        <div className="divide-y divide-border/50 rounded-xl border border-border/50 bg-card">
          {Array.from({ length: 4 }).map((_, i) => (
            <CompactItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  )
}
