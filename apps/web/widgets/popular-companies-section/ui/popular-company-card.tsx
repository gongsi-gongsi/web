import Link from 'next/link'
import { Card } from '@gs/ui'
import type { PopularCompany } from '@/entities/disclosure'

interface PopularCompanyCardProps {
  company: PopularCompany
}

export function PopularCompanyCard({ company }: PopularCompanyCardProps) {
  return (
    <Link href={`/disclosures?q=${encodeURIComponent(company.corpName)}`}>
      <Card interactive className="flex h-full flex-col gap-2 rounded-lg p-4 hover:bg-accent">
        {/* 순위 */}
        <span className="text-lg font-bold text-muted-foreground">{company.rank}</span>

        {/* 회사명 */}
        <h3 className="line-clamp-1 flex-1 text-sm font-medium text-foreground">
          {company.corpName}
        </h3>

        {/* 종목코드 */}
        <p className="text-xs text-muted-foreground">{company.stockCode}</p>
      </Card>
    </Link>
  )
}
