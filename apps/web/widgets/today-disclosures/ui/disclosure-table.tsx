import { DisclosureTableRow } from './disclosure-table-row'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureTableProps {
  disclosures: Disclosure[]
  showMeta?: boolean
  summarizedIds?: Set<string>
}

export function DisclosureTable({ disclosures, showMeta, summarizedIds }: DisclosureTableProps) {
  if (disclosures.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card py-20 text-center">
        <p className="text-sm text-muted-foreground">오늘 등록된 공시가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {disclosures.map((disclosure, index) => (
        <DisclosureTableRow
          key={disclosure.id}
          disclosure={disclosure}
          showMeta={showMeta}
          isSummarized={summarizedIds?.has(disclosure.id) ?? false}
          isLast={index === disclosures.length - 1}
        />
      ))}
    </div>
  )
}
