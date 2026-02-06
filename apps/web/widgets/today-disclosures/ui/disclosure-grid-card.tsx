import Link from 'next/link'
import { Card } from '@gs/ui'
import { getMarketBadge } from '@/entities/disclosure'
import type { Disclosure } from '@/entities/disclosure'
import { formatDate } from '@/shared/lib/date'

interface DisclosureGridCardProps {
  disclosure: Disclosure
}

export function DisclosureGridCard({ disclosure }: DisclosureGridCardProps) {
  const dateString = formatDate(disclosure.receivedAt)
  const marketBadge = getMarketBadge(disclosure.market)

  return (
    <Link href={disclosure.reportUrl} target="_blank" rel="noopener noreferrer">
      <Card interactive className="h-full gap-3 rounded-lg p-4 hover:bg-accent">
        {/* 상단: 날짜, 회사명, 종목코드, 시장 뱃지 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-sm font-semibold text-foreground">{dateString}</span>
            <span className="truncate text-sm text-muted-foreground">{disclosure.companyName}</span>
            {disclosure.stockCode !== '-' && (
              <span className="shrink-0 text-sm text-muted-foreground">
                ({disclosure.stockCode})
              </span>
            )}
          </div>
          {marketBadge && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${marketBadge.color}`}>
              {marketBadge.label}
            </span>
          )}
        </div>

        {/* 중간: 공시 제목 */}
        <h3 className="truncate text-base font-medium text-foreground">{disclosure.title}</h3>

        {/* 하단: 추가 정보 */}
        <div className="mt-auto text-sm text-muted-foreground">
          <p className="truncate">- 제출인 : {disclosure.submitter}</p>
        </div>
      </Card>
    </Link>
  )
}
