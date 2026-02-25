'use client'

import { FadersIcon } from '@phosphor-icons/react'

import { cn, Button } from '@gs/ui'

import type { SearchPeriod } from '@/entities/disclosure'

import { PERIOD_OPTIONS } from '../lib/filter-options'

interface SearchFilterChipsProps {
  period: SearchPeriod
  onPeriodChange: (period: SearchPeriod) => void
  onFilterOpen: () => void
}

export function SearchFilterChips({
  period,
  onPeriodChange,
  onFilterOpen,
}: SearchFilterChipsProps) {
  return (
    <div className="bg-card sticky top-14 z-40 flex items-center gap-2 overflow-x-auto px-4 pb-3 pt-3 md:static md:z-auto md:bg-transparent md:px-0 md:pt-0">
      <Button
        variant="outline"
        size="icon"
        onClick={onFilterOpen}
        aria-label="필터 설정"
        className="shrink-0 rounded-full"
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
            'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
            period === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
