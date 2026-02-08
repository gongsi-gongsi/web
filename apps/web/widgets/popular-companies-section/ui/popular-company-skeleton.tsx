import { Card, Skeleton } from '@gs/ui'

function PopularCompanyCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-2 rounded-lg p-4">
      {/* 순위 */}
      <Skeleton className="h-6 w-6" />

      {/* 회사명 */}
      <Skeleton className="h-4 w-3/4" />

      {/* 종목코드 */}
      <Skeleton className="h-3 w-1/2" />
    </Card>
  )
}

export function PopularCompanySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4">
      {/* 모바일: 3개 */}
      {[1, 2, 3].map(i => (
        <PopularCompanyCardSkeleton key={i} />
      ))}
      {/* PC: 추가 2개 */}
      {[4, 5].map(i => (
        <div key={i} className="hidden md:block">
          <PopularCompanyCardSkeleton />
        </div>
      ))}
    </div>
  )
}
