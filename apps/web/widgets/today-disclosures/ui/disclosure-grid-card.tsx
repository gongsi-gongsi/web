import Link from 'next/link'
import { Card, cn } from '@gs/ui'
import { getDisclosureTypeColor, getMarketBadge } from '@/entities/disclosure'
import type { Disclosure } from '@/entities/disclosure'
import { formatDate } from '@/shared/lib/date'

interface DisclosureGridCardProps {
  disclosure: Disclosure
}

export function DisclosureGridCard({ disclosure }: DisclosureGridCardProps) {
  const dateString = formatDate(disclosure.receivedAt)
  const marketBadge = getMarketBadge(disclosure.market)
  const typeColor = getDisclosureTypeColor(disclosure.type)

  return (
    <Link href={disclosure.reportUrl} target="_blank" rel="noopener noreferrer" className="group">
      <Card
        interactive
        className={cn(
          'relative h-full gap-0 overflow-hidden rounded-2xl p-5',
          'border-border/60 shadow-none transition-all duration-200',
          'hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md'
        )}
      >
        {/* 상단: 공시유형 도트 + 배지 + 시장 배지 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('inline-block size-2 rounded-full', typeColor.bg)} />
            <span
              className={cn(
                'rounded-md px-2 py-0.5 text-[11px] font-semibold',
                typeColor.bg,
                typeColor.text
              )}
            >
              {typeColor.label}
            </span>
          </div>
          {marketBadge && (
            <span
              className={cn('rounded-lg px-1.5 py-0.5 text-[10px] font-bold', marketBadge.color)}
            >
              {marketBadge.label}
            </span>
          )}
        </div>

        {/* 회사명 */}
        <h3 className="mt-3 text-base font-bold text-foreground">{disclosure.companyName}</h3>

        {/* 종목코드 */}
        {disclosure.stockCode !== '-' && (
          <span className="mt-0.5 text-xs text-muted-foreground">{disclosure.stockCode}</span>
        )}

        {/* 공시 제목 */}
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-secondary-foreground">
          {disclosure.title}
        </p>

        {/* 하단: 날짜 + 제출인 */}
        <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
          <time dateTime={disclosure.receivedAt}>{dateString}</time>
          <span className="text-border">·</span>
          <span className="truncate">{disclosure.submitter}</span>
        </div>
      </Card>
    </Link>
  )
}
