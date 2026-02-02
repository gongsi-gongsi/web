'use client'

interface SearchErrorFallbackProps {
  error: Error
  reset: () => void
}

export function SearchErrorFallback({ error: _error, reset }: SearchErrorFallbackProps) {
  return (
    <div className="py-12 text-center">
      <p className="mb-4 text-sm text-destructive">검색 결과를 불러오는데 실패했습니다</p>
      <button
        onClick={reset}
        className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
      >
        다시 시도
      </button>
    </div>
  )
}
