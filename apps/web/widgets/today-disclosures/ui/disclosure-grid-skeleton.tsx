export function DisclosureGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col rounded-lg border border-border bg-card p-4">
          {/* 상단: 날짜, 회사명, 종목코드 */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            </div>
            <div className="size-4 animate-pulse rounded bg-muted" />
          </div>

          {/* 중간: 공시 제목 */}
          <div className="mb-3">
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
          </div>

          {/* 하단: 추가 정보 */}
          <div className="mt-auto space-y-1">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
