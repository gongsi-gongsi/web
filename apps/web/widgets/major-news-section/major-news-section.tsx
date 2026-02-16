'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@gs/ui'
import { MajorNewsContent, MajorNewsSkeleton } from './ui'

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

function ErrorFallback({ reset }: ErrorFallbackProps) {
  return (
    <div className="py-8 text-center">
      <p className="mb-4 text-sm text-destructive">주요 뉴스를 불러오는데 실패했습니다</p>
      <Button variant="outline" size="sm" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}

export function MajorNewsSection() {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <section className="w-full">
      {/* PC 버전 */}
      <div className="hidden py-6 md:block md:px-4 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-4">
            <h2 className="text-xl font-bold">주요 뉴스</h2>
            <p className="mt-1 text-sm text-muted-foreground">최근 24시간 주요 증시 뉴스</p>
          </div>
          <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
            <Suspense fallback={<MajorNewsSkeleton />}>
              <MajorNewsContent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className="bg-card md:hidden">
        <div className="px-4 pb-4 pt-5">
          <h2 className="text-lg font-bold">주요 뉴스</h2>
          <p className="mt-1 text-xs text-muted-foreground">최근 24시간 주요 증시 뉴스</p>
        </div>
        <div className="pb-4">
          <ErrorBoundary fallback={ErrorFallback} onReset={reset}>
            <Suspense fallback={<MajorNewsSkeleton />}>
              <MajorNewsContent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  )
}
