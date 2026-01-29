import { Suspense } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { DisclosureList } from './ui/disclosure-list'
import { DisclosureListSkeleton } from './ui/disclosure-list-skeleton'

function ErrorFallback({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">공시 정보를 불러오는데 실패했습니다</p>
      <button
        onClick={reset}
        className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
      >
        다시 시도
      </button>
    </div>
  )
}

export default function DisclosuresPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">공시 목록</h1>
          <p className="mt-2 text-sm text-muted-foreground">오늘 등록된 모든 공시를 확인하세요</p>
        </div>

        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense fallback={<DisclosureListSkeleton />}>
            <DisclosureList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}
