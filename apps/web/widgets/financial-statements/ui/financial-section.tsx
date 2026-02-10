'use client'

import { Suspense, useState } from 'react'
import { ErrorBoundaryWithFallback } from '@/shared/lib/error-boundary'
import type { FinancialViewMode } from '@/entities/company'
import { SegmentControl, FinancialTableContent } from './financial-statements'
import { FinancialTableSkeleton } from './financial-statements-skeleton'

interface FinancialSectionProps {
  corpCode: string
}

export function FinancialSection({ corpCode }: FinancialSectionProps) {
  const [mode, setMode] = useState<FinancialViewMode>('yearly')

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
    </div>
  )
}
