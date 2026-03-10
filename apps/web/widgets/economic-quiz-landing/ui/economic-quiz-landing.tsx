import Link from 'next/link'

import { Button } from '@gs/ui'

const TIER_PREVIEWS = [
  { type: 'BEGINNER', name: '주린이', emoji: '🌱' },
  { type: 'INVESTOR', name: '가치 투자자', emoji: '📊' },
  { type: 'EXPERT', name: '전문 투자자', emoji: '🔭' },
  { type: 'LEGEND', name: '월가의 전설', emoji: '👑' },
] as const

const CATEGORY_BADGES = [
  { label: '주식', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  {
    label: '거시경제',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    label: '채권',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  },
  {
    label: '펀드/ETF',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  { label: '파생상품', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
]

export function EconomicQuizLanding() {
  return (
    <main className="relative flex h-[calc(100dvh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 pb-24 md:pb-0">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-[33%] rounded-full bg-primary/10 blur-3xl motion-safe:animate-pulse-slow dark:bg-primary/20" />

      <div className="flex w-full max-w-xs flex-col items-center text-center sm:max-w-sm">
        {/* Top badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-primary">
            6단계 투자 지식 티어
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          경제 용어 퀴즈
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">나의 금융 지식 레벨은?</p>

        {/* Emoji display */}
        <div className="relative my-6">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl motion-safe:animate-pulse-slow" />
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-primary/10 shadow-lg motion-safe:animate-float">
            <span className="text-7xl">📈</span>
          </div>
        </div>

        {/* Category badges */}
        <div
          className="mb-4 flex flex-wrap justify-center gap-1.5"
          role="list"
          aria-label="출제 카테고리"
        >
          {CATEGORY_BADGES.map(({ label, color }) => (
            <span
              key={label}
              role="listitem"
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${color}`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Tier previews */}
        <div
          className="mb-4 flex flex-wrap justify-center gap-1.5"
          role="list"
          aria-label="티어 미리보기"
        >
          {TIER_PREVIEWS.map(({ type, name, emoji }) => (
            <span
              key={type}
              role="listitem"
              className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {emoji} {name}
            </span>
          ))}
          <span
            role="listitem"
            className="inline-flex items-center rounded-full border border-border/40 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground/60"
          >
            +2가지
          </span>
        </div>

        {/* Stats */}
        <div className="mb-5 flex items-center gap-2.5 text-xs font-medium text-muted-foreground/70">
          <span>20개 문제</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>약 5분 소요</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>6가지 티어</span>
        </div>

        {/* CTA */}
        <Button asChild className="h-14 w-full rounded-2xl text-base font-bold shadow-md">
          <Link href="/economic-quiz/quiz">퀴즈 시작하기</Link>
        </Button>

        <p className="mt-3.5 text-xs text-muted-foreground/70">
          100개 문제 중 랜덤 20개가 출제됩니다
        </p>
      </div>
    </main>
  )
}
