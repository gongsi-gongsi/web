import { DisclosureCard } from './disclosure-card'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureCardListProps {
  disclosures: Disclosure[]
  showMeta?: boolean
}

export function DisclosureCardList({ disclosures, showMeta }: DisclosureCardListProps) {
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
        <DisclosureCard key={disclosure.id} disclosure={disclosure} showMeta={showMeta} />
      ))}
    </div>
  )
}
