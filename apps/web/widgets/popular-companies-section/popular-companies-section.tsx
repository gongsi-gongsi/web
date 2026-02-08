'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@gs/ui'
import { usePopularCompanies } from '@/entities/disclosure'
import { PopularCompanyList, PopularCompanySkeleton } from './ui'

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

function ErrorFallback({ reset }: ErrorFallbackProps) {
  return (
    <div className="py-8 text-center">
      <p className="mb-4 text-sm text-destructive">인기 회사를 불러오는데 실패했습니다</p>
      <Button variant="outline" size="sm" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}

function PopularCompaniesSectionContent() {
  const { data: companies } = usePopularCompanies(5)

  if (companies.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">인기 회사가 없습니다</p>
      </div>
    )
  }

  return <PopularCompanyList companies={companies} />
}

export function PopularCompaniesSection() {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <section className="w-full">
      {/* PC 버전 */}
      <div className="hidden py-6 md:block md:px-4 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-4">
            <h2 className="text-xl font-bold">인기 회사</h2>
          </div>
          <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
            <Suspense fallback={<PopularCompanySkeleton />}>
              <PopularCompaniesSectionContent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="px-4 pb-4 pt-6">
          <h2 className="text-lg font-bold">인기 회사</h2>
        </div>
        <div className="px-4 pb-6">
          <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
            <Suspense fallback={<PopularCompanySkeleton />}>
              <PopularCompaniesSectionContent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  )
}
