import { DisclosureTableRow } from './disclosure-table-row'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureTableProps {
  disclosures: Disclosure[]
}

export function DisclosureTable({ disclosures }: DisclosureTableProps) {
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
            <th className="w-[13%] px-4 py-3 text-left text-sm font-semibold">공시 유형</th>
            <th className="w-[12%] px-4 py-3 text-left text-sm font-semibold">시장</th>
            <th className="w-[20%] px-4 py-3 text-left text-sm font-semibold">회사명</th>
            <th className="w-[55%] px-4 py-3 text-left text-sm font-semibold">공시제목</th>
          </tr>
        </thead>
        <tbody>
          {disclosures.map(disclosure => (
            <DisclosureTableRow key={disclosure.id} disclosure={disclosure} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
