export function DisclosureSkeleton() {
  return (
    <div className="divide-y divide-border/50 pb-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="bg-card">
          <div className="flex animate-pulse flex-col gap-1.5 px-4 py-3">
            {/* Row 1: 뱃지 + 회사명 + 종목코드 + 공시유형 */}
            <div className="flex items-center gap-1.5">
              <div className="size-5 shrink-0 rounded bg-muted" />
              <div className="h-3.5 w-16 shrink-0 rounded bg-muted" />
              <div className="h-3 w-12 rounded bg-muted" />
              <div className="ml-auto h-4 w-12 shrink-0 rounded bg-muted" />
            </div>
            {/* Row 2: 제목 + AI 버튼 */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 flex-1 rounded bg-muted" />
              <div className="h-6 w-6 shrink-0 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
