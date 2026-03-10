import Image from 'next/image'
import Link from 'next/link'

import { MobileHeader } from '@/widgets/header'

const TYPE_PREVIEWS = [
  { code: 'GSFR', name: '저격수형' },
  { code: 'VLFR', name: '현인형' },
  { code: 'GSTR', name: '마법사형' },
  { code: 'GSFI', name: '서퍼형' },
  { code: 'VLTI', name: '철학자형' },
  { code: 'GLTR', name: '연구원형' },
] as const

export function InvestmentMbtiLanding() {
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
        {/* Glow orbs */}
        <div className="pointer-events-none absolute left-1/3 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 -z-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="flex w-full max-w-sm flex-col items-center gap-7 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              16가지 투자 클래스
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black leading-none tracking-tight text-foreground">
              투자 성향
              <br />
              테스트
            </h1>
            <p className="text-sm text-muted-foreground">
              15개 질문으로 알아보는 나만의 투자 스타일
            </p>
          </div>

          {/* Class grid */}
          <div className="grid w-full grid-cols-3 gap-2">
            {TYPE_PREVIEWS.map(({ code, name }) => (
              <div
                key={code}
                className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/60 pt-3 pb-2.5"
              >
                <Image
                  src={`/images/mbti/${code}.png`}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <span className="text-xs font-bold text-foreground">{name}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {code}
                </span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex w-full items-center justify-center divide-x divide-border rounded-xl border border-border/60 bg-card/60 py-4">
            {[
              { value: '15', label: '문항' },
              { value: '3분', label: '소요' },
              { value: '16', label: '유형' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-0.5">
                <span className="text-2xl font-black text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/investment-mbti/quiz" className="w-full">
            <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary font-bold text-base text-primary-foreground shadow-md transition-opacity hover:opacity-90 active:scale-[0.98]">
              내 투자 클래스 확인하기 →
            </div>
          </Link>

          <p className="text-xs text-muted-foreground/60">참고용 콘텐츠 · 투자 조언이 아닙니다</p>
        </div>
      </main>
    </>
  )
}
