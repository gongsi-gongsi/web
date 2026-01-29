import Link from 'next/link'
import { getMarketBadge, type Disclosure } from '@/entities/disclosure'
import { cn } from '@ds/ui'

interface DisclosureCardProps {
  disclosure: Disclosure
}

export function DisclosureCard({ disclosure }: DisclosureCardProps) {
  const marketBadge = getMarketBadge(disclosure.market)

  // 날짜 포맷팅 (MM.DD)
  const receivedDate = new Date(disclosure.receivedAt)
  const month = String(receivedDate.getMonth() + 1).padStart(2, '0')
  const day = String(receivedDate.getDate()).padStart(2, '0')
  const dateString = `${month}.${day}`

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
        <span className="w-20 shrink-0 truncate text-xs font-medium">{disclosure.companyName}</span>

        {/* 공시 제목 - 나머지 공간 */}
        <span className="flex-1 truncate text-xs">{disclosure.title}</span>

        {/* 날짜 - 고정 너비 */}
        <span className="w-10 shrink-0 text-right text-[10px] text-muted-foreground">
          {dateString}
        </span>
      </div>
    </Link>
  )
}
