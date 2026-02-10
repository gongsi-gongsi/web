'use client'

import { Suspense } from 'react'
import { ErrorBoundaryWithFallback } from '@/shared/lib/error-boundary'
import { FinancialStatements } from './financial-statements'
import { FinancialStatementsSkeleton } from './financial-statements-skeleton'

interface FinancialSectionProps {
  corpCode: string
}

export function FinancialSection({ corpCode }: FinancialSectionProps) {
  return (
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
      <Suspense fallback={<FinancialStatementsSkeleton />}>
        <FinancialStatements corpCode={corpCode} />
      </Suspense>
    </ErrorBoundaryWithFallback>
  )
}
