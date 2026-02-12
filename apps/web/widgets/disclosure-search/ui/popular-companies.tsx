'use client'

import Link from 'next/link'

import { TrendUp } from '@phosphor-icons/react'

import type { PopularCompany } from '@/entities/disclosure'

interface PopularCompaniesProps {
  companies: PopularCompany[]
}

export function PopularCompanies({ companies }: PopularCompaniesProps) {
  if (companies.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">인기 검색 회사가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 px-4 py-3">
        <TrendUp className="size-4 text-primary" weight="bold" />
        <h2 className="text-sm font-semibold">인기 검색 회사</h2>
      </div>
      <ul role="listbox" aria-label="인기 검색 회사 목록">
        {companies.map(company => (
          <li key={company.corpCode} role="option" aria-selected={false}>
            <Link
              href={`/companies/${company.corpCode}`}
              className="flex items-center gap-3 rounded-xl px-4 py-3 interactive-card"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {company.rank}
              </div>
              <span className="flex-1 text-sm font-medium">{company.corpName}</span>
              <span className="text-xs text-muted-foreground">{company.stockCode}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PopularCompaniesSkeleton() {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="size-4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      </div>
      <ul>
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="size-8 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="ml-auto h-3 w-16 animate-pulse rounded bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  )
}
