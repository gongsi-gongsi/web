export function DisclosureTableSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 rounded-xl bg-background px-2 py-3"
        >
          {/* 접수일자 */}
          <div className="w-[100px] shrink-0">
            <div className="h-4 w-20 rounded bg-muted" />
          </div>

          {/* 시장 */}
          <div className="w-[80px] shrink-0">
            <div className="h-4 w-16 rounded bg-muted" />
          </div>

          {/* 회사명 */}
          <div className="w-[140px] shrink-0">
            <div className="h-4 w-24 rounded bg-muted" />
          </div>

          {/* 공시제목 */}
          <div className="flex-1">
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
