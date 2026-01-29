import { DisclosureListItem } from './disclosure-list-item'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureListProps {
  disclosures: Disclosure[]
}

export function DisclosureList({ disclosures }: DisclosureListProps) {
  if (disclosures.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">오늘 등록된 공시가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {disclosures.map(disclosure => (
        <DisclosureListItem key={disclosure.id} disclosure={disclosure} />
      ))}
    </div>
  )
}
