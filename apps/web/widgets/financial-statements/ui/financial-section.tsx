'use client'

import { Suspense, useState } from 'react'
import { ErrorBoundaryWithFallback } from '@/shared/lib/error-boundary'
import { AiSummaryCard } from '@/features/ai-company-summary'
import type { FinancialViewMode } from '@/entities/company'
import { SegmentControl, FinancialTableContent, SummaryChartsContent } from './financial-statements'
import { FinancialTableSkeleton, SummaryChartsSkeleton } from './financial-statements-skeleton'
import { CompanyOverview, CompanyOverviewSkeleton } from './company-overview'

interface FinancialSectionProps {
  corpCode: string
}

/**
 * 재무제표 탭 콘텐츠
 * 분기별/연도별 토글, 주요 지표, 재무 현황 테이블을 포함합니다
 */
export function FinancialSection({ corpCode }: FinancialSectionProps) {
  const [mode, setMode] = useState<FinancialViewMode>('quarterly')

  return (
    <div className="space-y-4">
      <div className="px-4 md:px-0">
        <SegmentControl value={mode} onChange={setMode} />
      </div>

      <ErrorBoundaryWithFallback
        fallback={({ reset }) => (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">재무 데이터를 불러오는데 실패했습니다</p>
            <button
              type="button"
              onClick={reset}
              className="border-input bg-background hover:bg-accent rounded-md border px-4 py-2 text-sm"
            >
              다시 시도
            </button>
          </div>
        )}
      >
        <Suspense key={mode} fallback={<FinancialTableSkeleton />}>
          <FinancialTableContent corpCode={corpCode} mode={mode} />
        </Suspense>
      </ErrorBoundaryWithFallback>

      {/* 데이터 출처 */}
      <div className="px-4 pt-4 md:px-0">
        <p className="text-muted-foreground text-xs">
          데이터 출처: 금융감독원 전자공시시스템(DART)
        </p>
      </div>
    </div>
  )
}

interface SummarySectionProps {
  corpCode: string
}

/**
 * 요약 탭 콘텐츠
 * 기업 개요, 분기별/연도별 토글, 수익성/성장성 차트를 포함합니다
 */
export function SummarySection({ corpCode }: SummarySectionProps) {
  const [mode, setMode] = useState<FinancialViewMode>('quarterly')

  return (
    <div className="space-y-4">
      {/* 기업 개요 */}
      <Suspense fallback={<CompanyOverviewSkeleton />}>
        <CompanyOverview corpCode={corpCode} />
      </Suspense>

      {/* 모바일 구분선 */}
      <div className="bg-background h-6 md:hidden" />

      {/* AI 기업 분석 */}
      <AiSummaryCard corpCode={corpCode} />

      {/* 모바일 구분선 */}
      <div className="bg-background h-6 md:hidden" />

      <div className="px-4 md:px-0">
        <SegmentControl value={mode} onChange={setMode} />
      </div>

      <ErrorBoundaryWithFallback
        fallback={({ reset }) => (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">재무 데이터를 불러오는데 실패했습니다</p>
            <button
              type="button"
              onClick={reset}
              className="border-input bg-background hover:bg-accent rounded-md border px-4 py-2 text-sm"
            >
              다시 시도
            </button>
          </div>
        )}
      >
        <Suspense key={mode} fallback={<SummaryChartsSkeleton />}>
          <SummaryChartsContent corpCode={corpCode} mode={mode} />
        </Suspense>
      </ErrorBoundaryWithFallback>

      {/* 데이터 출처 */}
      <div className="px-4 pt-4 md:px-0">
        <p className="text-muted-foreground text-xs">
          데이터 출처: 금융감독원 전자공시시스템(DART)
        </p>
      </div>
    </div>
  )
}
