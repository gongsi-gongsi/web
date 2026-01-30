'use client'

import { ReactNode } from 'react'
import { ErrorBoundary } from '@suspensive/react'

function DefaultErrorFallback({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">데이터를 불러오는데 실패했습니다</p>
      <button
        onClick={reset}
        className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
      >
        다시 시도
      </button>
    </div>
  )
}

interface ErrorBoundaryWithFallbackProps {
  children: ReactNode
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode
}

export function ErrorBoundaryWithFallback({
  children,
  fallback = DefaultErrorFallback,
}: ErrorBoundaryWithFallbackProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}
