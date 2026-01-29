import type { Disclosure } from '@/entities/disclosure'

interface DisclosureTableRowProps {
  disclosure: Disclosure
}

const MARKET_LABELS: Record<string, string> = {
  kospi: '유가증권',
  kosdaq: '코스닥',
  konex: '코스넥',
  all: '-',
}

export function DisclosureTableRow({ disclosure }: DisclosureTableRowProps) {
  const marketLabel = MARKET_LABELS[disclosure.market] || '-'

  const receivedDate = new Date(disclosure.receivedAt)
  const year = receivedDate.getFullYear()
  const month = String(receivedDate.getMonth() + 1).padStart(2, '0')
  const day = String(receivedDate.getDate()).padStart(2, '0')
  const dateString = `${year}.${month}.${day}`

  function handleClick() {
    window.open(disclosure.reportUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer border-b border-border transition-colors hover:bg-accent"
    >
      <td className="px-4 py-3 text-sm text-foreground">
        <div className="truncate">{dateString}</div>
      </td>
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
    </tr>
  )
}
