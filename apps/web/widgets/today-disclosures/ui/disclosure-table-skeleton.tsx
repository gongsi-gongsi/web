export function DisclosureTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-5 border-b border-border/40 px-5 py-4 last:border-b-0"
        >
          {/* 컬러 도트 */}
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="size-2.5 animate-pulse rounded-full bg-muted" />
          </div>

          {/* 시장 배지 */}
          <div className="w-8 shrink-0 text-center">
            <div className="mx-auto size-7 animate-pulse rounded-lg bg-muted" />
          </div>

          {/* 회사명 */}
          <div className="w-[140px] shrink-0">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-14 animate-pulse rounded bg-muted" />
          </div>

          {/* 공시유형 배지 */}
          <div className="h-6 w-16 shrink-0 animate-pulse rounded-md bg-muted" />

          {/* 공시제목 */}
          <div className="min-w-0 flex-1">
            <div className="h-4 w-full max-w-[400px] animate-pulse rounded bg-muted" />
          </div>

          {/* AI 버튼 */}
          <div className="h-7 w-16 shrink-0 animate-pulse rounded-md bg-muted" />

          {/* 화살표 */}
          <div className="size-4 shrink-0 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
