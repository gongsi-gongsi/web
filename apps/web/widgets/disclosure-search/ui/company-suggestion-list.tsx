'use client'

import Link from 'next/link'

import { BuildingsIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'

import type { CompanySuggestion } from '@/entities/disclosure'

interface CompanySuggestionListProps {
  suggestions: CompanySuggestion[]
  query: string
}

export function CompanySuggestionList({ suggestions, query }: CompanySuggestionListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="py-16 text-center">
        <MagnifyingGlassIcon className="mx-auto mb-3 size-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">검색 결과가 없습니다</p>
      </div>
    )
  }

  return (
    <ul>
      {suggestions.map(item => (
        <li key={item.corpCode}>
          <Link
            href={`/companies/${item.corpCode}`}
            className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent/50 active:bg-accent/50"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground md:bg-primary/10 md:text-primary">
              <BuildingsIcon className="size-4" weight="fill" />
            </div>
            <span className="text-sm font-medium">
              <HighlightedName name={item.corpName} query={query} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function CompanySuggestionSkeleton() {
  return (
    <ul>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="size-9 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  )
}

interface HighlightedNameProps {
  name: string
  query: string
}

function HighlightedName({ name, query }: HighlightedNameProps) {
  if (!query) return <>{name}</>

  const lowerName = name.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerName.indexOf(lowerQuery)

  if (index === -1) return <>{name}</>

  const before = name.slice(0, index)
  const match = name.slice(index, index + query.length)
  const after = name.slice(index + query.length)

  return (
    <>
      {before}
      <span className="font-semibold text-primary">{match}</span>
      {after}
    </>
  )
}
