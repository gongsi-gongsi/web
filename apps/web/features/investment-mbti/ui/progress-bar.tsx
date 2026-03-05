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
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">
          {current} / {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
