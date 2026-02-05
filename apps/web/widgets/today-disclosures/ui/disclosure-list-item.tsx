import Link from 'next/link'
import { cn } from '@gs/ui'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureListItemProps {
  disclosure: Disclosure
}

const MARKET_LABELS: Record<string, string> = {
  kospi: '유가증권',
  kosdaq: '코스닥',
  konex: '코스넥',
  all: '-',
}

export function DisclosureListItem({ disclosure }: DisclosureListItemProps) {
  const marketLabel = MARKET_LABELS[disclosure.market] || '-'

  const receivedDate = new Date(disclosure.receivedAt)
  const year = receivedDate.getFullYear()
  const month = String(receivedDate.getMonth() + 1).padStart(2, '0')
  const day = String(receivedDate.getDate()).padStart(2, '0')
  const dateString = `${year}.${month}.${day}`

  return (
    <Link
      href={disclosure.reportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-center gap-4 rounded-xl bg-background px-2 py-3',
        'interactive-card'
      )}
    >
      {/* 접수일자 */}
      <div className="w-[100px] shrink-0">
        <span className="text-sm text-foreground">{dateString}</span>
      </div>

      {/* 시장 */}
      <div className="w-[80px] shrink-0">
        <span className="text-sm text-muted-foreground">{marketLabel}</span>
      </div>

      {/* 회사명 */}
      <div className="w-[140px] shrink-0">
        <div className="truncate text-sm font-medium text-foreground">
          {disclosure.companyName}
          {disclosure.stockCode !== '-' && (
            <span className="ml-1 text-xs text-muted-foreground">({disclosure.stockCode})</span>
          )}
        </div>
      </div>

      {/* 공시제목 */}
      <div className="flex-1 overflow-hidden">
        <div className="truncate text-sm text-foreground transition-colors group-hover:text-foreground">
          {disclosure.title}
        </div>
      </div>
    </Link>
  )
}
