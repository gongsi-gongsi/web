'use client'

import Link from 'next/link'

import { TrendUpIcon } from '@phosphor-icons/react'
import { cn } from '@gs/ui'

import type { PopularCompany } from '@/entities/disclosure'

interface PopularCompaniesProps {
  companies: PopularCompany[]
}

const RANK_STYLES = {
  first: {
    card: 'bg-amber-500/10 border-amber-400/40',
    rank: 'text-amber-500',
  },
  top: {
    card: 'bg-card border-border',
    rank: 'text-foreground',
  },
  rest: {
    card: 'bg-card border-border',
    rank: 'text-muted-foreground/60',
  },
}

function getRankStyle(rank: number) {
  if (rank === 1) return RANK_STYLES.first
  if (rank <= 3) return RANK_STYLES.top
  return RANK_STYLES.rest
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
    <>
      {/* PC: 5-column grid cards */}
      <div className="hidden md:block">
        <div className="mt-8 mb-4 flex items-center gap-2">
          <TrendUpIcon className="size-5 text-primary" weight="bold" />
          <h2 className="text-base font-semibold">인기 검색 회사</h2>
        </div>
        <nav aria-label="인기 검색 회사 목록">
          <ul className="grid grid-cols-5 gap-3">
            {companies.map(company => {
              const style = getRankStyle(company.rank)
              return (
                <li key={company.corpCode}>
                  <Link href={`/companies/${company.corpCode}`} className="group block">
                    <div
                      className={cn(
                        'relative flex h-full flex-col overflow-hidden rounded-xl border p-4 transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        style.card
                      )}
                    >
                      <span
                        className={cn(
                          'font-sans text-[2rem] leading-none font-extrabold tracking-tighter',
                          style.rank
                        )}
                      >
                        {company.rank}
                      </span>
                      <div className="mt-3 flex flex-col gap-1">
                        <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {company.corpName}
                        </h3>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {company.stockCode}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <TrendUpIcon className="size-4 text-primary" weight="bold" />
          <h2 className="text-sm font-semibold">인기 검색 회사</h2>
        </div>
        <nav aria-label="인기 검색 회사 목록">
          <ul className="divide-y divide-border/50">
            {companies.map(company => (
              <li key={company.corpCode}>
                <Link
                  href={`/companies/${company.corpCode}`}
                  className="flex items-center gap-3 px-4 py-3 active:bg-accent/50"
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums',
                      company.rank === 1
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {company.rank}
                  </span>
                  <span className="flex-1 text-sm font-medium">{company.corpName}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {company.stockCode}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export function PopularCompaniesSkeleton() {
  return (
    <>
      {/* PC skeleton */}
      <div className="hidden md:block">
        <div className="mt-8 mb-4 flex items-center gap-2">
          <div className="size-5 animate-pulse rounded bg-muted" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        </div>
        <ul className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="rounded-xl border border-border p-4">
              <div className="h-8 w-6 animate-pulse rounded bg-muted" />
              <div className="mt-3 flex flex-col gap-1">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-3 w-14 animate-pulse rounded bg-muted" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden">
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
    </>
  )
}
