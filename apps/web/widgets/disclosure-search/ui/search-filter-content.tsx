'use client'

import { cn } from '@ds/ui'

import type { SearchPeriod, Market, DisclosureType } from '@/entities/disclosure'

import { MARKET_OPTIONS, TYPE_OPTIONS } from '../lib/filter-options'

interface FilterParams {
  period: SearchPeriod
  market: Market
  type: DisclosureType | 'all'
}

interface SearchFilterContentProps {
  params: FilterParams
  onChange: (params: FilterParams) => void
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:bg-accent'
      )}
    >
      {label}
    </button>
  )
}

export function SearchFilterContent({ params, onChange }: SearchFilterContentProps) {
  return (
    <div className="flex flex-col gap-5 py-2">
      {/* 시장 필터 */}
      <div>
        <p className="mb-2 text-sm font-medium">시장</p>
        <div className="flex flex-wrap gap-2">
          {MARKET_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={params.market === option.value}
              onClick={() => onChange({ ...params, market: option.value })}
            />
          ))}
        </div>
      </div>

      {/* 공시 유형 필터 */}
      <div>
        <p className="mb-2 text-sm font-medium">공시 유형</p>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={params.type === option.value}
              onClick={() => onChange({ ...params, type: option.value })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
