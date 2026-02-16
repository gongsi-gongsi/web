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

  return (
    <>
      {/* 모바일: 플랫한 리스트 (간격 없음) */}
      <div className="md:hidden">
        {data.items.map((item, index) => (
          <MajorNewsCard key={`${item.link}-${index}`} item={item} />
        ))}
      </div>

      {/* PC: 3열 그리드 카드 */}
      <div className="hidden grid-cols-3 gap-4 md:grid">
        {data.items.map((item, index) => (
          <MajorNewsCard key={`${item.link}-${index}`} item={item} />
        ))}
      </div>
    </>
  )
}
