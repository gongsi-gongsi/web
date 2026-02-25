import Link from 'next/link'
import { cn } from '@gs/ui'
import { getMarketBadge, getDisclosureTypeColor, type Disclosure } from '@/entities/disclosure'
import { AiSummaryButton } from '@/features/ai-disclosure-summary'
import { formatDate } from '@/shared/lib/date'

interface DisclosureCardProps {
  disclosure: Disclosure
  showMeta?: boolean
  summarizedIds?: Set<string>
}

export function DisclosureCard({ disclosure, showMeta, summarizedIds }: DisclosureCardProps) {
  const marketBadge = getMarketBadge(disclosure.market)
  const typeColor = getDisclosureTypeColor(disclosure.type)
  const isSummarized = summarizedIds?.has(disclosure.id) ?? false

  return (
    <Link
      href={disclosure.reportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-card active:bg-accent/50"
    >
      <div className="flex flex-col gap-1.5 px-4 py-3">
        {/* Row 1: 시장배지 + 회사명 + 종목코드 + 공시유형 */}
        <div className="flex items-center gap-1.5">
          {marketBadge && (
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold',
                marketBadge.color
              )}
            >
              {marketBadge.label}
            </span>
          )}
          <span className="shrink-0 text-sm font-semibold">{disclosure.companyName}</span>
          <span className="text-xs text-muted-foreground">{disclosure.stockCode}</span>
          <span
            className={cn(
              'ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium',
              typeColor.bg,
              typeColor.text
            )}
          >
            {typeColor.label}
          </span>
        </div>

        {/* Row 2: 공시 제목 + AI 버튼 */}
        <div className="flex items-center gap-2">
          <span className="flex-1 truncate text-sm text-muted-foreground">{disclosure.title}</span>
          <AiSummaryButton disclosure={disclosure} isSummarized={isSummarized} variant="card" />
        </div>
      </div>

      {showMeta && (
        <div className="flex items-center gap-3 px-4 pb-3 text-xs text-muted-foreground">
          <span>{disclosure.submitter}</span>
          <span>{formatDate(disclosure.receivedAt)}</span>
        </div>
      )}
    </Link>
  )
}
