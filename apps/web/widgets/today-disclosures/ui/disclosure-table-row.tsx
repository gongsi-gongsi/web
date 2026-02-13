import type { Disclosure } from '@/entities/disclosure'
import { formatDate } from '@/shared/lib/date'

interface DisclosureTableRowProps {
  disclosure: Disclosure
  showMeta?: boolean
}

const MARKET_LABELS: Record<string, string> = {
  kospi: '유가증권',
  kosdaq: '코스닥',
  konex: '코스넥',
  all: '-',
}

export function DisclosureTableRow({ disclosure, showMeta }: DisclosureTableRowProps) {
  const marketLabel = MARKET_LABELS[disclosure.market] || '-'

  function handleClick() {
    window.open(disclosure.reportUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer border-b border-border transition-colors hover:bg-accent"
    >
      <td className="px-4 py-3 text-sm text-foreground">
        <div className="truncate">{marketLabel}</div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        <div className="truncate" title={`${disclosure.companyName} (${disclosure.stockCode})`}>
          {disclosure.companyName}
          {disclosure.stockCode !== '-' && (
            <span className="ml-1 text-xs text-foreground">({disclosure.stockCode})</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        <div className="truncate" title={disclosure.title}>
          {disclosure.title}
        </div>
      </td>
      {showMeta && (
        <>
          <td className="px-4 py-3 text-sm text-muted-foreground">
            <div className="truncate" title={disclosure.submitter}>
              {disclosure.submitter}
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-muted-foreground">
            {formatDate(disclosure.receivedAt)}
          </td>
        </>
      )}
    </tr>
  )
}
