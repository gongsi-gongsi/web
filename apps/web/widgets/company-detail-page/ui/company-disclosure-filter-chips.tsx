'use client'

import { FadersIcon } from '@phosphor-icons/react'

import { cn, Button } from '@gs/ui'

import type { SearchPeriod } from '@/entities/disclosure'

import { PERIOD_OPTIONS } from '@/widgets/disclosure-search/lib/filter-options'

interface CompanyDisclosureFilterChipsProps {
  period: SearchPeriod
  onPeriodChange: (period: SearchPeriod) => void
  onFilterOpen: () => void
}

export function CompanyDisclosureFilterChips({
  period,
  onPeriodChange,
  onFilterOpen,
}: CompanyDisclosureFilterChipsProps) {
  return (
    <div className="bg-card sticky top-[5.75rem] z-30 flex items-center gap-2 overflow-x-auto px-4 pt-3 pb-3 md:top-[2.75rem] md:z-40 md:bg-background md:px-0 md:pt-0">
      <Button
        variant="outline"
        size="icon"
        onClick={onFilterOpen}
        aria-label="필터 설정"
        className="shrink-0"
      >
        <FadersIcon className="size-4" />
      </Button>
      {PERIOD_OPTIONS.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onPeriodChange(option.value)}
          aria-pressed={period === option.value}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            period === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:bg-accent'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
