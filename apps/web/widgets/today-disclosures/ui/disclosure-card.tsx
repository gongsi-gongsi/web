import Link from 'next/link'
import { cn } from '@gs/ui'
import { getMarketBadge, type Disclosure } from '@/entities/disclosure'
import { formatDate } from '@/shared/lib/date'

interface DisclosureCardProps {
  disclosure: Disclosure
  showMeta?: boolean
}

export function DisclosureCard({ disclosure, showMeta }: DisclosureCardProps) {
  const marketBadge = getMarketBadge(disclosure.market)

  return (
    <Link
      href={disclosure.reportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl bg-card interactive-card hover:bg-accent"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        {/* 증시 뱃지 */}
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

        {/* 회사명 - 고정 너비 */}
        <span className="w-16 shrink-0 truncate text-sm font-medium">{disclosure.companyName}</span>

        {/* 공시 제목 - 나머지 공간 */}
        <span className="flex-1 truncate text-sm">{disclosure.title}</span>
      </div>

      {showMeta && (
        <div className="flex items-center gap-3 px-4 pb-3 pl-11 text-sm text-muted-foreground">
          <span>{disclosure.submitter}</span>
          <span>{formatDate(disclosure.receivedAt)}</span>
        </div>
      )}
    </Link>
  )
}
