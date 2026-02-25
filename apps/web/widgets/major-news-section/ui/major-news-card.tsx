import { Card } from '@gs/ui'
import type { NewsItem } from '@/entities/news'
import { formatRelativeTime } from '@/entities/news'

interface MajorNewsCardProps {
  item: NewsItem
  variant?: 'featured' | 'compact'
}

/**
 * URL이 안전한지 검증합니다 (http/https만 허용)
 * @param url - 검증할 URL 문자열
 * @returns 안전하면 원본 URL, 아니면 '#'
 */
function getSafeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // http, https 프로토콜만 허용 (javascript:, data: 등 차단)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
    return '#'
  } catch {
    // URL 파싱 실패 시 안전하지 않은 것으로 간주
    return '#'
  }
}

export function MajorNewsCard({ item, variant = 'compact' }: MajorNewsCardProps) {
  const safeLink = getSafeUrl(item.link)

  return (
    <a href={safeLink} target="_blank" rel="noopener noreferrer">
      {/* 모바일: 플랫한 리스트 아이템 */}
      <div className="flex flex-col px-4 py-3 active:bg-accent/50 md:hidden">
        <p className="text-[11px] font-medium text-primary">
          {item.source} · {formatRelativeTime(item.pubDate)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-[1.35] text-foreground">
          {item.title}
        </h3>
      </div>

      {/* PC: variant에 따라 다른 레이아웃 */}
      {variant === 'featured' ? (
        <Card
          interactive
          className="group hidden h-full flex-col rounded-xl border border-border/50 bg-card px-5 py-5 shadow-none hover:border-border md:flex"
        >
          <span className="w-fit rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {item.source}
          </span>
          <h3 className="mt-3 line-clamp-3 text-xl font-bold leading-[1.35] text-foreground group-hover:text-primary">
            {item.title}
          </h3>
          <p className="mt-auto pt-3 text-xs text-muted-foreground">
            {formatRelativeTime(item.pubDate)}
          </p>
        </Card>
      ) : (
        <div className="hidden px-4 py-3.5 hover:bg-accent/50 md:block">
          <h3 className="truncate text-[15px] font-semibold leading-[1.35] text-foreground">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">{item.source}</span>
            {' · '}
            {formatRelativeTime(item.pubDate)}
          </p>
        </div>
      )}
    </a>
  )
}
