import { DisclosureGridCard } from './disclosure-grid-card'
import type { Disclosure } from '@/entities/disclosure'

interface DisclosureGridProps {
  disclosures: Disclosure[]
}

export function DisclosureGrid({ disclosures }: DisclosureGridProps) {
  if (disclosures.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card py-16 text-center">
        <p className="text-sm text-muted-foreground">오늘 등록된 공시가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {disclosures.map(disclosure => (
        <DisclosureGridCard key={disclosure.id} disclosure={disclosure} />
      ))}
    </div>
  )
}
