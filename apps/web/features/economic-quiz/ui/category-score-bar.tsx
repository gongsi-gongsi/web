import { cn } from '@gs/ui'

import type { QuizCategory } from '../types'

const CATEGORY_LABELS: Record<QuizCategory, string> = {
  STOCK: '주식',
  ECONOMY: '거시경제',
  BOND: '채권',
  FUND: '펀드/ETF',
  DERIVATIVE: '파생상품',
}

const CATEGORY_COLORS: Record<QuizCategory, string> = {
  STOCK: 'bg-blue-500',
  ECONOMY: 'bg-emerald-500',
  BOND: 'bg-violet-500',
  FUND: 'bg-amber-500',
  DERIVATIVE: 'bg-rose-500',
}

interface CategoryScoreBarProps {
  category: QuizCategory
  correct: number
  total: number
}

export function CategoryScoreBar({ category, correct, total }: CategoryScoreBarProps) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{CATEGORY_LABELS[category]}</span>
        <span
          className={cn(
            'font-semibold',
            percent >= 60
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          )}
        >
          {correct}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            CATEGORY_COLORS[category]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
