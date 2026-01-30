import { DisclosureTableSkeleton } from '@/widgets/today-disclosures/ui/disclosure-table-skeleton'
import { DisclosureSkeleton } from '@/widgets/today-disclosures/ui/disclosure-skeleton'

export function DisclosureListSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        {/* 탭 스켈레톤 */}
        <div className="flex gap-6 border-b border-border pb-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-5 w-16 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>

      {/* PC 버전 */}
      <div className="hidden md:block">
        <DisclosureTableSkeleton />
      </div>

      {/* 모바일 버전 */}
      <div className="md:hidden">
        <DisclosureSkeleton />
      </div>
    </div>
  )
}
