import { cn } from '@gs/ui'

interface TendencyBarProps {
  axisLabel: string
  leftLetter: string
  leftLabel: string
  leftPercent: number
  rightLetter: string
  rightLabel: string
  rightPercent: number
  className?: string
}

export function TendencyBar({
  axisLabel,
  leftLetter,
  leftLabel,
  leftPercent,
  rightLetter,
  rightLabel,
  rightPercent,
  className,
}: TendencyBarProps) {
  const isDominantLeft = leftPercent >= rightPercent

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <span
          className={cn(
            'font-semibold',
            isDominantLeft ? 'text-foreground' : 'text-muted-foreground/50'
          )}
        >
          {leftLabel}
        </span>
        <span className="text-[11px] text-muted-foreground/50">{axisLabel}</span>
        <span
          className={cn(
            'font-semibold',
            !isDominantLeft ? 'text-foreground' : 'text-muted-foreground/50'
          )}
        >
          {rightLabel}
        </span>
      </div>

      {/* Bar row */}
      <div className="flex items-center gap-2.5">
        {/* Track */}
        <div className="relative h-9 flex-1 rounded-2xl bg-muted">
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full overflow-hidden rounded-2xl bg-primary"
            style={{ width: `${leftPercent}%` }}
          >
            <span className="flex h-full items-center pl-3 text-xs font-bold text-primary-foreground">
              {leftLetter} {leftPercent}
            </span>
          </div>
        </div>
        {/* Right value */}
        <span className="w-12 shrink-0 text-right text-xs font-semibold text-muted-foreground">
          {rightPercent} {rightLetter}
        </span>
      </div>
    </div>
  )
}
