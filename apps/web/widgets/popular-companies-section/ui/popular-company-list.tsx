'use client'

import type { PopularCompany } from '@/entities/disclosure'
import { PopularCompanyCard } from './popular-company-card'

interface PopularCompanyListProps {
  companies: PopularCompany[]
}

export function PopularCompanyList({ companies }: PopularCompanyListProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4">
      {/* 모바일: 3개만 표시, PC: 5개 표시 */}
      {companies.slice(0, 3).map(company => (
        <PopularCompanyCard key={company.corpCode} company={company} />
      ))}
      {companies.slice(3, 5).map(company => (
        <div key={company.corpCode} className="hidden md:block">
          <PopularCompanyCard company={company} />
        </div>
      ))}
    </div>
  )
}
