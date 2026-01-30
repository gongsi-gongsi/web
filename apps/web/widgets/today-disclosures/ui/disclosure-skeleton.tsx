export function DisclosureSkeleton() {
  return (
    <div className="flex flex-col pb-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="rounded-xl bg-card">
          <div className="flex animate-pulse items-center gap-2 px-4 py-3">
            {/* 뱃지 skeleton */}
            <div className="size-5 shrink-0 rounded bg-muted" />
            {/* 회사명 skeleton - text-xs 크기 */}
            <div className="h-3 w-20 shrink-0 rounded bg-muted" />
            {/* 공시 제목 skeleton - text-xs 크기 */}
            <div className="h-3 flex-1 rounded bg-muted" />
            {/* 날짜 skeleton - text-[10px] 크기 */}
            <div className="h-2.5 w-10 shrink-0 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
