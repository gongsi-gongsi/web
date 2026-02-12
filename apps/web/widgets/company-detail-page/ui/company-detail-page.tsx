'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { Skeleton, cn } from '@gs/ui'
import { BackButton } from '@/shared/ui/back-button'
import { MobileHeader } from '@/widgets/header'
import { FinancialSection, SummarySection } from '@/widgets/financial-statements'
import { useCompanyInfo } from '@/entities/company'

interface CompanyDetailPageProps {
  corpCode: string
}

type TabValue = 'summary' | 'financial' | 'disclosure' | 'news' | 'community'

const TABS: { value: TabValue; label: string }[] = [
  { value: 'summary', label: '요약' },
  { value: 'financial', label: '재무제표' },
  { value: 'disclosure', label: '공시' },
  { value: 'news', label: '뉴스' },
  { value: 'community', label: '커뮤니티' },
]

interface CompanyTabsProps {
  activeTab: TabValue
  onTabChange: (tab: TabValue) => void
  className?: string
}

function CompanyTabs({ activeTab, onTabChange, className }: CompanyTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const updateIndicator = () => {
      const activeTabEl = tabRefs.current[activeTab]
      if (activeTabEl && activeTabEl.offsetWidth > 0) {
        setIndicatorStyle({
          left: activeTabEl.offsetLeft,
          width: activeTabEl.offsetWidth,
        })
      }
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)

    return () => {
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeTab])

  return (
    <div className={cn('relative flex gap-6 border-b border-border', className)}>
      {TABS.map(tab => (
        <button
          key={tab.value}
          ref={el => {
            tabRefs.current[tab.value] = el
          }}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'shrink-0 cursor-pointer pb-3 text-md font-medium transition-colors',
            activeTab === tab.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
      {/* 애니메이션 언더라인 */}
      <span
        className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  )
}

function CompanyHeader({ corpCode }: { corpCode: string }) {
  const { data: companyInfo } = useCompanyInfo(corpCode)

  const corpName = companyInfo?.corpName ?? '기업 정보 없음'
  const stockCode = companyInfo?.stockCode

  return (
    <>
      {/* 모바일 회사명 */}
      <div className="px-4 pb-2 pt-4 md:hidden">
        <h1 className="text-xl font-bold">{corpName}</h1>
        {stockCode && <p className="text-muted-foreground mt-0.5 text-sm">{stockCode}</p>}
      </div>

      {/* PC 헤더 */}
      <div className="mb-8 hidden md:block">
        <h1 className="text-2xl font-bold md:text-3xl">{corpName}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {stockCode && `${stockCode} · `}기업 코드: {corpCode}
        </p>
      </div>
    </>
  )
}

function CompanyHeaderSkeleton() {
  return (
    <>
      {/* 모바일 스켈레톤 */}
      <div className="px-4 pb-2 pt-4 md:hidden">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="mt-1 h-5 w-20" />
      </div>

      {/* PC 스켈레톤 */}
      <div className="mb-8 hidden md:block">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>
    </>
  )
}

function TabContent({ activeTab, corpCode }: { activeTab: TabValue; corpCode: string }) {
  switch (activeTab) {
    case 'summary':
      return <SummarySection corpCode={corpCode} />
    case 'financial':
      return <FinancialSection corpCode={corpCode} />
    case 'disclosure':
      return <ComingSoon title="공시" />
    case 'news':
      return <ComingSoon title="뉴스" />
    case 'community':
      return <ComingSoon title="커뮤니티" />
  }
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-muted-foreground text-sm">{title} 기능 준비중입니다</p>
    </div>
  )
}

export function CompanyDetailPage({ corpCode }: CompanyDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('summary')

  return (
    <>
      {/* 모바일 헤더 */}
      <MobileHeader left={<BackButton />} />

      {/* 모바일 버전 */}
      <div className="bg-card min-h-screen md:hidden">
        {/* 회사명 */}
        <Suspense fallback={<CompanyHeaderSkeleton />}>
          <CompanyHeader corpCode={corpCode} />
        </Suspense>

        {/* 탭 메뉴 */}
        <CompanyTabs activeTab={activeTab} onTabChange={setActiveTab} className="px-4" />

        {/* 탭 콘텐츠 */}
        <div className="py-6">
          <TabContent activeTab={activeTab} corpCode={corpCode} />
        </div>
      </div>

      {/* PC 버전 */}
      <div className="mx-auto hidden max-w-7xl py-8 md:block md:px-4 lg:px-8">
        <Suspense fallback={<CompanyHeaderSkeleton />}>
          <CompanyHeader corpCode={corpCode} />
        </Suspense>

        {/* 탭 메뉴 */}
        <CompanyTabs activeTab={activeTab} onTabChange={setActiveTab} className="mb-6" />

        {/* 탭 콘텐츠 */}
        <TabContent activeTab={activeTab} corpCode={corpCode} />
      </div>
    </>
  )
}
