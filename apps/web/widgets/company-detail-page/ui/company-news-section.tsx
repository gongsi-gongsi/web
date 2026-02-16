'use client'

import { useMemo, useState } from 'react'
import { Skeleton } from '@gs/ui'
import { CaretDownIcon, NewspaperIcon } from '@phosphor-icons/react'

import { useCompanyInfo } from '@/entities/company'
import { useCompanyNews, formatRelativeTime } from '@/entities/news'
import type { NewsItem } from '@/entities/news'

type SortOrder = 'latest' | 'relevance'

const SORT_LABELS: Record<SortOrder, string> = {
  latest: '최신순',
  relevance: '관련도순',
}

interface CompanyNewsSectionProps {
  corpCode: string
}

function SortToggle({
  value,
  onChange,
}: {
  value: SortOrder
  onChange: (value: SortOrder) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value === 'latest' ? 'relevance' : 'latest')}
      className="flex cursor-pointer items-center gap-1 px-4 py-3 text-sm font-medium text-muted-foreground"
    >
      {SORT_LABELS[value]}
      <CaretDownIcon className="size-4" />
    </button>
  )
}

function NewsListItem({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl bg-card px-4 py-4 interactive-card hover:bg-accent"
    >
      <p className="truncate text-[15px] font-medium leading-snug">{item.title}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {formatRelativeTime(item.pubDate)} · {item.source}
      </p>
    </a>
  )
}

function NewsContent({ corpName }: { corpName: string }) {
  const { data } = useCompanyNews(corpName, 30)
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')

  const sortedItems = useMemo(() => {
    if (sortOrder === 'relevance') return data.items
    return [...data.items].sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )
  }, [data.items, sortOrder])

  if (data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <NewspaperIcon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">관련 뉴스가 없습니다</p>
      </div>
    )
  }

  return (
    <div>
      <SortToggle value={sortOrder} onChange={setSortOrder} />
      <div className="space-y-2">
        {sortedItems.map((item, index) => (
          <NewsListItem key={`${item.link}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-card px-4 py-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="mt-1.5 h-5 w-3/4" />
          <Skeleton className="mt-2.5 h-3 w-28" />
        </div>
      ))}
    </div>
  )
}

export function CompanyNewsSection({ corpCode }: CompanyNewsSectionProps) {
  const { data: companyInfo } = useCompanyInfo(corpCode)
  const corpName = companyInfo?.corpName

  if (!corpName) {
    return <NewsSkeleton />
  }

  return <NewsContent corpName={corpName} />
}

export { NewsSkeleton }
