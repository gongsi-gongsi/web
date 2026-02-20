import { cn } from '@gs/ui'

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
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">오늘 등록된 공시가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full table-fixed">
        <thead className="bg-muted">
          <tr>
            <th className="w-[10%] px-4 py-3 text-left text-sm font-semibold">시장</th>
            <th className="w-[18%] px-4 py-3 text-left text-sm font-semibold">회사명</th>
            <th
              className={cn(
                showMeta ? 'w-[42%]' : 'w-[60%]',
                'px-4 py-3 text-left text-sm font-semibold'
              )}
            >
              공시제목
            </th>
            <th className="w-[8%] px-4 py-3 text-left text-sm font-semibold">AI</th>
            {showMeta && (
              <>
                <th className="w-[10%] px-4 py-3 text-left text-sm font-semibold">제출인</th>
                <th className="w-[10%] px-4 py-3 text-left text-sm font-semibold">접수일</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {disclosures.map(disclosure => (
            <DisclosureTableRow
              key={disclosure.id}
              disclosure={disclosure}
              showMeta={showMeta}
              isSummarized={summarizedIds?.has(disclosure.id) ?? false}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
