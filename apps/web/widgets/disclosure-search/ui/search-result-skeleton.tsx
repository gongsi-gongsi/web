import { DisclosureTableSkeleton } from '@/widgets/today-disclosures/ui/disclosure-table-skeleton'
import { DisclosureSkeleton } from '@/widgets/today-disclosures/ui/disclosure-skeleton'

export function SearchResultSkeleton() {
  return (
    <>
      <div className="px-4 py-3 md:px-0 md:py-4">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      </div>

      <div className="pt-1 pb-2 md:hidden">
        <DisclosureSkeleton />
      </div>

      <div className="hidden md:block">
        <DisclosureTableSkeleton />
      </div>
    </>
  )
}
