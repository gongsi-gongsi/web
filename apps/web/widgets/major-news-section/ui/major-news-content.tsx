'use client'

import { NewspaperIcon } from '@phosphor-icons/react'
import { useMajorMarketNews } from '@/entities/news'
import { MajorNewsCard } from './major-news-card'

export function MajorNewsContent() {
  const { data } = useMajorMarketNews(5)

  if (data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <NewspaperIcon className="size-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">최근 뉴스가 없습니다</p>
      </div>
    )
  }

  const [featured, ...rest] = data.items

  return (
    <>
      {/* 모바일: 플랫한 리스트 */}
      <div className="divide-y divide-border/50 md:hidden">
        {data.items.map((item, index) => (
          <MajorNewsCard key={`${item.link}-${index}`} item={item} />
        ))}
      </div>

      {/* PC: Feature Article + Sidebar */}
      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-[3fr_2fr]">
        <MajorNewsCard item={featured} variant="featured" />
        <div className="overflow-hidden divide-y divide-border/50 rounded-xl border border-border/50 bg-card">
          {rest.map((item, index) => (
            <MajorNewsCard key={`${item.link}-${index}`} item={item} variant="compact" />
          ))}
        </div>
      </div>
    </>
  )
}
