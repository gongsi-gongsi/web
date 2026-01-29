import { DisclosureTableSkeleton } from '@/widgets/today-disclosures/ui/disclosure-table-skeleton'
import { DisclosureSkeleton } from '@/widgets/today-disclosures/ui/disclosure-skeleton'

export function DisclosureListSkeleton() {
  return (
    <>
      {/* 모바일 버전 - 카드 리스트 스켈레톤만 */}
      <div className="pb-2 pt-2 md:hidden">
        <DisclosureSkeleton />
      </div>

      {/* PC 버전 - 테이블 스켈레톤만 */}
      <div className="hidden md:block">
        <DisclosureTableSkeleton />
      </div>
    </>
  )
}
