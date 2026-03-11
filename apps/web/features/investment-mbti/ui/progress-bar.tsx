import { cn } from '@gs/ui'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-muted-foreground">
          MISSION <span className="text-foreground">{String(current).padStart(2, '0')}</span>
          <span className="text-muted-foreground/50"> / {String(total).padStart(2, '0')}</span>
        </span>
        <span className="font-mono text-xs font-bold text-primary">{percent}%</span>
      </div>

      {/* XP bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
