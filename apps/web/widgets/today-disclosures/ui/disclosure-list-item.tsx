import Link from 'next/link'
import { cn } from '@gs/ui'
import type { Disclosure } from '@/entities/disclosure'
import { getMarketBadge } from '@/entities/disclosure'
import { formatDate } from '@/shared/lib/date'

interface DisclosureListItemProps {
  disclosure: Disclosure
}

export function DisclosureListItem({ disclosure }: DisclosureListItemProps) {
  const marketBadge = getMarketBadge(disclosure.market)
  const dateString = formatDate(disclosure.receivedAt)

  return (
    <Link
      href={disclosure.reportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-center gap-4 rounded-xl bg-background px-2 py-2',
        'interactive-card'
      )}
    >
      {/* 접수일자 */}
      <div className="w-[100px] shrink-0">
        <span className="text-base text-foreground">{dateString}</span>
      </div>

      {/* 시장 */}
      <div className="w-[80px] shrink-0">
        {marketBadge ? (
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium',
              marketBadge.color
            )}
          >
            {marketBadge.label}
          </span>
        ) : (
          <span className="text-base text-muted-foreground">-</span>
        )}
      </div>

      {/* 회사명 */}
      <div className="w-[140px] shrink-0">
        <div className="truncate text-base font-medium text-foreground">
          {disclosure.companyName}
          {disclosure.stockCode !== '-' && (
            <span className="ml-1 text-xs text-muted-foreground">({disclosure.stockCode})</span>
          )}
        </div>
      </div>

      {/* 공시제목 */}
      <div className="flex-1 overflow-hidden">
        <div className="truncate text-base text-foreground transition-colors group-hover:text-foreground">
          {disclosure.title}
        </div>
      </div>
    </Link>
  )
}
