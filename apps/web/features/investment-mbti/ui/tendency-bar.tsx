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
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span
          className={cn(
            'font-bold',
            isDominantLeft ? 'text-foreground' : 'text-muted-foreground/40'
          )}
        >
          {leftLabel}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          {axisLabel}
        </span>
        <span
          className={cn(
            'font-bold',
            !isDominantLeft ? 'text-foreground' : 'text-muted-foreground/40'
          )}
        >
          {rightLabel}
        </span>
      </div>

      {/* Dual bar */}
      <div className="flex h-8 w-full overflow-hidden rounded-xl bg-muted">
        {/* Left fill */}
        <div
          className="flex items-center justify-start pl-2.5 bg-primary transition-all duration-500"
          style={{ width: `${leftPercent}%` }}
        >
          {leftPercent >= 25 && (
            <span className="font-mono text-xs font-black text-primary-foreground">
              {leftLetter} {leftPercent}%
            </span>
          )}
        </div>
        {/* Right fill */}
        <div className="flex flex-1 items-center justify-end pr-2.5 bg-muted">
          {rightPercent >= 25 && (
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {rightPercent}% {rightLetter}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
