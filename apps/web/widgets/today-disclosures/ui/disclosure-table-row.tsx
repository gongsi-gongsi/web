import { cn } from '@gs/ui'

import type { Disclosure } from '@/entities/disclosure'
import { getMarketBadge, getDisclosureTypeColor } from '@/entities/disclosure'
import { AiSummaryButton } from '@/features/ai-disclosure-summary'
import { formatDate } from '@/shared/lib/date'

interface DisclosureTableRowProps {
  disclosure: Disclosure
  showMeta?: boolean
  isSummarized?: boolean
  isLast?: boolean
}

export function DisclosureTableRow({
  disclosure,
  showMeta,
  isSummarized = false,
  isLast = false,
}: DisclosureTableRowProps) {
  const marketBadge = getMarketBadge(disclosure.market)
  const typeColor = getDisclosureTypeColor(disclosure.type)

  function handleClick() {
    window.open(disclosure.reportUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex cursor-pointer items-center gap-5 px-5 py-4 transition-colors duration-150',
        'hover:bg-muted/50',
        !isLast && 'border-b border-border/40'
      )}
    >
      {/* 공시유형 컬러 도트 */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span className={cn('inline-block size-2.5 rounded-full', typeColor.bg)} />
      </div>

      {/* 시장 배지 */}
      <div className="w-8 shrink-0 text-center">
        {marketBadge && (
          <span
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-lg text-[11px] font-bold',
              marketBadge.color
            )}
          >
            {marketBadge.label}
          </span>
        )}
      </div>

      {/* 회사명 + 종목코드 */}
      <div className="w-[140px] shrink-0">
        <span className="block truncate text-sm font-semibold text-foreground">
          {disclosure.companyName}
        </span>
        {disclosure.stockCode !== '-' && (
          <span className="text-[11px] text-muted-foreground">{disclosure.stockCode}</span>
        )}
      </div>

      {/* 공시유형 배지 */}
      <span
        className={cn(
          'shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold',
          typeColor.bg,
          typeColor.text
        )}
      >
        {typeColor.label}
      </span>

      {/* 공시제목 */}
      <span className="min-w-0 flex-1 truncate text-sm text-secondary-foreground group-hover:text-foreground">
        {disclosure.title}
      </span>

      {/* 메타정보 (showMeta) */}
      {showMeta && (
        <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground lg:flex">
          <span className="truncate">{disclosure.submitter}</span>
          <span>{formatDate(disclosure.receivedAt)}</span>
        </div>
      )}

      {/* AI 요약 */}
      <div className="shrink-0">
        <AiSummaryButton disclosure={disclosure} isSummarized={isSummarized} variant="table" />
      </div>

      {/* 화살표 아이콘 */}
      <svg
        className="size-4 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  )
}
