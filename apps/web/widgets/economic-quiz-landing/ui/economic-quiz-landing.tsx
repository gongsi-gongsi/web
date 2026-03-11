import Link from 'next/link'

import { MobileHeader } from '@/widgets/header'

const TIER_PREVIEWS = [
  { type: 'BEGINNER', name: '주린이', emoji: '🌱' },
  { type: 'AMATEUR', name: '개미 투자자', emoji: '🐜' },
  { type: 'INVESTOR', name: '가치 투자자', emoji: '📊' },
  { type: 'EXPERT', name: '전문 투자자', emoji: '🔭' },
  { type: 'MASTER', name: '경제통', emoji: '🏆' },
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
    <>
      <MobileHeader />
      <main className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 pb-24 md:pb-0">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="pointer-events-none absolute left-1/3 top-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex w-full max-w-sm flex-col items-center gap-7 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              6단계 투자 지식 티어
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black leading-none tracking-tight text-foreground">
              경제 용어
              <br />
              퀴즈
            </h1>
            <p className="text-sm text-muted-foreground">나의 금융 지식 레벨은?</p>
          </div>

          {/* Tier grid */}
          <div className="grid w-full grid-cols-3 gap-2">
            {TIER_PREVIEWS.map(({ type, name, emoji }) => (
              <div
                key={type}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-card/60 py-3.5"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-bold text-foreground">{name}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {type}
                </span>
              </div>
            ))}
          </div>

          {/* Category badges */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {CATEGORY_BADGES.map(({ label, color }) => (
              <span
                key={label}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex w-full items-center justify-center divide-x divide-border rounded-xl border border-border/60 bg-card/60 py-4">
            {[
              { value: '20', label: '문항' },
              { value: '5분', label: '소요' },
              { value: '6', label: '티어' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-0.5">
                <span className="text-2xl font-black text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/economic-quiz/quiz" className="w-full">
            <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary font-bold text-base text-primary-foreground shadow-md transition-opacity hover:opacity-90 active:scale-[0.98]">
              퀴즈 시작하기 →
            </div>
          </Link>

          <p className="text-xs text-muted-foreground/60">100개 문제 중 랜덤 20개 출제</p>
        </div>
      </main>
    </>
  )
}
