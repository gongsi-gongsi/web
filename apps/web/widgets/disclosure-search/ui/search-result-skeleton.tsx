import { DisclosureTableSkeleton } from '@/widgets/today-disclosures/ui/disclosure-table-skeleton'
import { DisclosureSkeleton } from '@/widgets/today-disclosures/ui/disclosure-skeleton'

export function SearchResultSkeleton() {
  return (
    <>
      {/* 헤더 스켈레톤 */}
      <div className="px-4 py-3 md:px-0">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      </div>

      {/* 모바일 버전 */}
      <div className="pb-2 pt-2 md:hidden">
        <DisclosureSkeleton />
      </div>

      {/* PC 버전 */}
      <div className="hidden md:block">
        <DisclosureTableSkeleton />
      </div>
    </>
  )
}
