import { Card } from '@gs/ui'
import type { NewsItem } from '@/entities/news'
import { formatRelativeTime } from '@/entities/news'

interface MajorNewsCardProps {
  item: NewsItem
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

export function MajorNewsCard({ item }: MajorNewsCardProps) {
  const safeLink = getSafeUrl(item.link)

  return (
    <a href={safeLink} target="_blank" rel="noopener noreferrer">
      {/* 모바일: 플랫한 리스트 아이템 (토스 앱 스타일) */}
      <div className="flex flex-col border-b border-border px-4 py-2.5 hover:bg-accent/50 active:bg-accent md:hidden">
        <h3 className="truncate text-sm font-medium leading-tight text-foreground">{item.title}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {item.source} · {formatRelativeTime(item.pubDate)}
        </p>
      </div>

      {/* PC: 카드형 (토스 증권 스타일) */}
      <Card
        interactive
        className="hidden h-full flex-col rounded-xl bg-card px-4 py-3.5 hover:bg-accent md:flex"
      >
        <h3 className="truncate text-[15px] font-medium leading-snug text-foreground">
          {item.title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          {item.source} · {formatRelativeTime(item.pubDate)}
        </p>
      </Card>
    </a>
  )
}
