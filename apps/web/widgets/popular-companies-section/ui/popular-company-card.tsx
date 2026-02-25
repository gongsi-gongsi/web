import Link from 'next/link'
import { cn } from '@gs/ui'
import type { PopularCompany } from '@/entities/disclosure'

interface PopularCompanyCardProps {
  company: PopularCompany
}

const FIRST_STYLE = {
  accent: 'bg-amber-500/10 border-amber-400/40',
  rankColor: 'text-amber-500',
}

const DEFAULT_STYLE = {
  accent: 'bg-card border-border',
  rankColor: 'text-muted-foreground/60',
}

export function PopularCompanyCard({ company }: PopularCompanyCardProps) {
  const style = company.rank === 1 ? FIRST_STYLE : DEFAULT_STYLE

  return (
    <Link href={`/companies/${company.corpCode}`} className="group block">
      <div
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-xl border p-4 transition-all duration-200',
          'hover:-translate-y-0.5 hover:shadow-md',
          style.accent
        )}
      >
        {/* 순위 */}
        <span
          className={cn(
            'font-sans text-[2rem] leading-none font-extrabold tracking-tighter',
            style.rankColor
          )}
        >
          {company.rank}
        </span>

        {/* 회사명 + 종목코드 */}
        <div className="mt-3 flex flex-col gap-1">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {company.corpName}
          </h3>
          <span className="text-xs tabular-nums text-muted-foreground">{company.stockCode}</span>
        </div>
      </div>
    </Link>
  )
}
