'use client'

import { NewspaperIcon } from '@phosphor-icons/react'
import { useMajorMarketNews } from '@/entities/news'
import { MajorNewsCard } from './major-news-card'

export function MajorNewsContent() {
  const { data } = useMajorMarketNews(6)

  if (data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <NewspaperIcon className="size-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">최근 뉴스가 없습니다</p>
      </div>
    )
  }

  const featured = data.items.slice(0, 2)
  const rest = data.items.slice(2)

  return (
    <>
      {/* 모바일: 플랫한 리스트 */}
      <div className="divide-y divide-border/50 md:hidden">
        {data.items.map((item, index) => (
          <MajorNewsCard key={`${item.link}-${index}`} item={item} />
        ))}
      </div>

      {/* PC: 좌 2개(featured) + 우 4개(compact) — 높이 동기화 */}
      <div className="hidden md:flex md:gap-5">
        {/* 좌: featured 2개, 각각 우측 2칸 높이 */}
        <div className="flex flex-1 flex-col gap-5">
          {featured.map((item, index) => (
            <div key={`${item.link}-${index}`} className="flex-1">
              <MajorNewsCard item={item} variant="featured" />
            </div>
          ))}
        </div>
        {/* 우: compact 4개 */}
        <div className="flex flex-1 flex-col divide-y divide-border/50 overflow-hidden rounded-xl border border-border/50 bg-card">
          {rest.map((item, index) => (
            <div key={`${item.link}-${index}`} className="flex flex-1">
              <MajorNewsCard item={item} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
