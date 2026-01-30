import { Suspense } from 'react'
import { ErrorBoundaryWithFallback } from '@/shared/lib/error-boundary'
import { DisclosureList } from './ui/disclosure-list'
import { DisclosureListSkeleton } from './ui/disclosure-list-skeleton'

export default function DisclosuresPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">공시 목록</h1>
          <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <ErrorBoundaryWithFallback>
          <Suspense fallback={<DisclosureListSkeleton />}>
            <DisclosureList />
          </Suspense>
        </ErrorBoundaryWithFallback>
      </div>
    </main>
  )
}
