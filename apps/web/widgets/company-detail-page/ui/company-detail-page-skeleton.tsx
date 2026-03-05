import { Skeleton } from '@gs/ui'
import { BackButton } from '@/shared/ui/back-button'
import { MobileHeader } from '@/widgets/header'
import { SummaryChartsSkeleton } from '@/widgets/financial-statements'

const TABS = ['요약', '재무제표', '공시', '뉴스', '커뮤니티']

function TabBarSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex gap-6 border-b border-border bg-card${className ? ` ${className}` : ''}`}
    >
      {TABS.map(label => (
        <span key={label} className="shrink-0 pb-3 text-md font-medium text-muted-foreground">
          {label}
        </span>
      ))}
    </div>
  )
}

export function CompanyDetailPageSkeleton() {
  return (
    <>
      {/* 모바일 헤더 */}
      <MobileHeader left={<BackButton />} />

      {/* 모바일 버전 */}
      <div className="min-h-screen bg-card pb-24 md:hidden">
        {/* 회사명 */}
        <div className="px-4 pb-2 pt-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="mt-1 h-5 w-20" />
        </div>

        {/* 탭 메뉴 */}
        <div className="sticky top-14 z-40">
          <TabBarSkeleton className="px-4" />
        </div>

        {/* 탭 콘텐츠 */}
        <div className="py-6">
          <SummaryChartsSkeleton />
        </div>
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-7xl py-8 md:block md:px-4 lg:px-8">
        {/* 회사명 */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>

        {/* 탭 메뉴 */}
        <div className="sticky top-0 z-40">
          <TabBarSkeleton className="mb-6 bg-background" />
        </div>

        {/* 탭 콘텐츠 */}
        <div className="py-6">
          <SummaryChartsSkeleton />
        </div>
      </div>
    </>
  )
}
