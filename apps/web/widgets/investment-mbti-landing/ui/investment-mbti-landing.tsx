import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@gs/ui'

const TYPE_PREVIEWS = [
  { code: 'GSFR', name: '저격수형', emoji: '🎯' },
  { code: 'GSFI', name: '서퍼형', emoji: '🏄' },
  { code: 'GSTR', name: '마법사형', emoji: '🔮' },
  { code: 'VLFR', name: '현인형', emoji: '🦉' },
] as const

export function InvestmentMbtiLanding() {
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
      {/* Ambient glow orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-[33%] motion-safe:animate-pulse-slow rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />

      <div className="flex w-full max-w-xs flex-col items-center text-center sm:max-w-sm">
        {/* Top pill badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5">
          <span className="inline-block h-1.5 w-1.5 motion-safe:animate-pulse rounded-full bg-primary" />
          <span className="text-xs font-semibold tracking-wide text-primary">
            16가지 투자 유형 진단
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          투자 성향 테스트
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          나의 투자 성향과 숨겨진 능력은?
        </p>

        {/* Character with glow */}
        <div className="relative my-5">
          <div className="absolute inset-0 -z-10 motion-safe:animate-pulse-slow rounded-full bg-primary/20 blur-2xl" />
          <div className="motion-safe:animate-float">
            <Image
              src="/images/mbti/GSFR.png"
              alt="투자성향 MBTI 캐릭터"
              width={210}
              height={210}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Type preview chips */}
        <div
          className="mb-4 flex flex-wrap justify-center gap-1.5"
          role="list"
          aria-label="투자 유형 미리보기"
        >
          {TYPE_PREVIEWS.map(({ code, name, emoji }) => (
            <span
              key={code}
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
            +12가지
          </span>
        </div>

        {/* Stats */}
        <div className="mb-5 flex items-center gap-2.5 text-xs font-medium text-muted-foreground/70">
          <span>15개 질문</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>약 3분 소요</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
          <span>16가지 유형</span>
        </div>

        {/* CTA Button */}
        <Button asChild className="h-14 w-full rounded-2xl text-base font-bold shadow-md">
          <Link href="/investment-mbti/quiz">투자 성향 알아보기</Link>
        </Button>

        <p className="mt-3.5 text-xs text-muted-foreground/70">
          본 진단은 참고용 콘텐츠이며 투자 조언이 아닙니다
        </p>
      </div>
    </main>
  )
}
