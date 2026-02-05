export function DisclosureTableSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 rounded-xl bg-card px-2 py-2"
        >
          {/* 접수일자 */}
          <div className="w-[100px] shrink-0">
            <div className="h-4 w-20 rounded bg-muted" />
          </div>

          {/* 시장 badge */}
          <div className="w-[80px] shrink-0">
            <div className="h-6 w-16 rounded-md bg-muted" />
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
