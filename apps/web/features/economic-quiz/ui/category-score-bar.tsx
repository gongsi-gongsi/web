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
  const isPassing = percent >= 60

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">{CATEGORY_LABELS[category]}</span>
        <span
          className={`font-mono text-xs font-bold ${isPassing ? 'text-emerald-500' : 'text-rose-500'}`}
        >
          {correct}/{total}
          <span className="ml-1 font-normal text-muted-foreground">({percent}%)</span>
        </span>
      </div>
      <div className="relative h-7 w-full overflow-hidden rounded-xl bg-muted">
        <div
          className={`h-full rounded-xl transition-all duration-700 ease-out ${CATEGORY_COLORS[category]}`}
          style={{ width: `${percent}%` }}
        />
        {percent >= 20 && (
          <span className="absolute inset-y-0 left-3 flex items-center font-mono text-xs font-bold text-white">
            {percent}%
          </span>
        )}
      </div>
    </div>
  )
}
