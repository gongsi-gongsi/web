'use client'

import Link from 'next/link'

import { Buildings } from '@phosphor-icons/react'

import type { CompanySuggestion } from '@/entities/disclosure'

interface CompanySuggestionListProps {
  suggestions: CompanySuggestion[]
  query: string
}

export function CompanySuggestionList({ suggestions, query }: CompanySuggestionListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">검색 결과가 없습니다</p>
      </div>
    )
  }

  return (
    <ul role="listbox">
      {suggestions.map(item => (
        <li key={item.corpCode} role="option" aria-selected={false}>
          <Link
            href={`/companies/${item.corpCode}`}
            className="flex items-center gap-3 rounded-xl px-4 py-3 interactive-card"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Buildings className="size-5" weight="fill" />
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
          <div className="size-10 animate-pulse rounded-full bg-muted" />
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
      <span className="text-primary">{match}</span>
      {after}
    </>
  )
}
