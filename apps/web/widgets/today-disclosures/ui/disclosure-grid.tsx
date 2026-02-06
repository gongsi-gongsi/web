import { DisclosureGridCard } from './disclosure-grid-card'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureGridProps {
  disclosures: Disclosure[]
}

export function DisclosureGrid({ disclosures }: DisclosureGridProps) {
  if (disclosures.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">오늘 등록된 공시가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {disclosures.map(disclosure => (
        <DisclosureGridCard key={disclosure.id} disclosure={disclosure} />
      ))}
    </div>
  )
}
