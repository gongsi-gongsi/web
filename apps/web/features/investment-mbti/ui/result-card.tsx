'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button, cn } from '@gs/ui'
import { ArrowCounterClockwiseIcon, LinkIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useState } from 'react'

import { AXIS_LABELS, TENDENCY_INFO } from '../data/axis-descriptions'
import type { Tendency } from '../data/questions'
import type { MbtiTypeData } from '../data/mbti-types'
import type { MbtiResult } from '../model/calculate-mbti-type'
import { TendencyBar } from './tendency-bar'

interface ResultCardProps {
  result: MbtiResult
  typeData: MbtiTypeData
  onReset?: () => void
}

const TENDENCY_EMOJI: Record<Tendency, string> = {
  G: '📈',
  V: '🛡️',
  S: '⚡',
  L: '🌱',
  F: '📊',
  T: '📉',
  R: '⚖️',
  I: '🎲',
}

export function ResultCard({ result, typeData, onReset }: ResultCardProps) {
  const [imgError, setImgError] = useState(false)

  async function handleShare() {
    const shareUrl = `${window.location.origin}/investment-mbti/result/${result.type}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('링크가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  const axisPercentMap: Record<string, number> = {
    G: result.percentages.GV.G,
    V: result.percentages.GV.V,
    S: result.percentages.SL.S,
    L: result.percentages.SL.L,
    F: result.percentages.FT.F,
    T: result.percentages.FT.T,
    R: result.percentages.RI.R,
    I: result.percentages.RI.I,
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 메인 결과 카드 */}
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
        {/* 헤더 — 유형 코드 + 이름 */}
        <div className="flex flex-col items-center gap-4 border-b border-border/60 px-6 py-8">
          {/* 캐릭터 이미지 */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-2xl" />
            {!imgError ? (
              <Image
                src={typeData.imagePath}
                alt={typeData.name}
                width={160}
                height={160}
                className="object-contain drop-shadow-md"
                onError={() => setImgError(true)}
              />
            ) : (
              <span
                className="flex h-36 w-36 items-center justify-center text-7xl"
                role="img"
                aria-label={typeData.name}
              >
                {typeData.emoji}
              </span>
            )}
          </div>

          {/* 4글자 타입 코드 */}
          <div className="flex items-center gap-2">
            {Array.from(result.type).map((char, i) => (
              <div
                key={`${char}-${i}`}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10 text-2xl font-black text-primary"
              >
                {char}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black text-foreground">{typeData.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{typeData.subtitle}</p>
            <p className="mt-2 text-sm italic text-muted-foreground/70">
              &ldquo;{typeData.tagline}&rdquo;
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* 설명 */}
          <p className="text-sm leading-relaxed text-secondary-foreground">
            {typeData.description}
          </p>

          {/* 성향 강도 — stat bars */}
          <div>
            <p className="mb-4 text-[11px] font-bold tracking-widest text-muted-foreground">
              투자 성향 지표
            </p>
            <div className="flex flex-col gap-4">
              <TendencyBar
                axisLabel={AXIS_LABELS.GV}
                leftLetter="G"
                leftLabel="수익추구"
                leftPercent={result.percentages.GV.G}
                rightLetter="V"
                rightLabel="안정추구"
                rightPercent={result.percentages.GV.V}
              />
              <TendencyBar
                axisLabel={AXIS_LABELS.SL}
                leftLetter="S"
                leftLabel="단기매매"
                leftPercent={result.percentages.SL.S}
                rightLetter="L"
                rightLabel="장기투자"
                rightPercent={result.percentages.SL.L}
              />
              <TendencyBar
                axisLabel={AXIS_LABELS.FT}
                leftLetter="F"
                leftLabel="펀더멘털"
                leftPercent={result.percentages.FT.F}
                rightLetter="T"
                rightLabel="기술적분석"
                rightPercent={result.percentages.FT.T}
              />
              <TendencyBar
                axisLabel={AXIS_LABELS.RI}
                leftLetter="R"
                leftLabel="원칙형"
                leftPercent={result.percentages.RI.R}
                rightLetter="I"
                rightLabel="직관형"
                rightPercent={result.percentages.RI.I}
              />
            </div>
          </div>

          {/* 성향 분석 */}
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-widest text-muted-foreground">
              강점 분석
            </p>
            <div className="flex flex-col gap-3">
              {(Array.from(result.type) as Tendency[]).map(tendency => {
                const info = TENDENCY_INFO[tendency]
                const percent = axisPercentMap[tendency]
                return (
                  <div
                    key={tendency}
                    className="flex gap-3 rounded-xl border border-border/50 bg-muted/30 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-base">
                      {TENDENCY_EMOJI[tendency]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">{info.label}</span>
                        <span className="font-mono text-xs font-semibold text-primary shrink-0">
                          {percent}%
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 강점 / 약점 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
              <p className="mb-2.5 text-[10px] font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
                장점
              </p>
              <ul className="space-y-1.5">
                {typeData.strengths.map(s => (
                  <li
                    key={s}
                    className="flex items-start gap-1.5 text-xs text-emerald-800 dark:text-emerald-300"
                  >
                    <span className="mt-0.5 shrink-0 font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50/50 p-4 dark:bg-rose-950/20">
              <p className="mb-2.5 text-[10px] font-bold tracking-widest text-rose-700 dark:text-rose-400">
                주의점
              </p>
              <ul className="space-y-1.5">
                {typeData.weaknesses.map(w => (
                  <li
                    key={w}
                    className="flex items-start gap-1.5 text-xs text-rose-800 dark:text-rose-300"
                  >
                    <span className="mt-0.5 shrink-0 font-bold">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 투자 경향 */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 text-[10px] font-bold tracking-widest text-primary/80">
              투자 스타일
            </p>
            <p className="text-xs leading-relaxed text-foreground/70">{typeData.tendency}</p>
            <p className="mt-2 text-[10px] text-muted-foreground/50">
              * 특정 종목 매수·매도를 권유하는 것이 아닙니다.
            </p>
          </div>

          {/* 공유 + 다시하기 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="relative flex-1 justify-center"
              onClick={handleShare}
            >
              <LinkIcon className="absolute left-4 size-4" />
              공유하기
            </Button>
            {onReset ? (
              <Button
                variant="outline"
                className="relative flex-1 justify-center"
                onClick={onReset}
              >
                <ArrowCounterClockwiseIcon className="absolute left-4 size-4" />
                다시하기
              </Button>
            ) : (
              <Button asChild variant="outline" className="relative flex-1 justify-center">
                <Link href="/investment-mbti">
                  <ArrowCounterClockwiseIcon className="absolute left-4 size-4" />
                  다시하기
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 면책 공고 */}
      <div
        className={cn(
          'rounded-2xl border border-border/40 bg-muted/30 p-4',
          'text-[11px] leading-relaxed text-muted-foreground'
        )}
      >
        <p className="mb-2 font-bold text-foreground/60">[투자 위험 고지 및 면책 공고]</p>
        <p className="mb-2">
          본 투자성향 진단 서비스는 정보 제공 목적의 오락성 콘텐츠로, 다음 사항을 명확히 고지합니다.
        </p>
        <ol className="list-decimal space-y-1.5 pl-4">
          <li>
            <strong>비투자자문 서비스</strong>: 공시공시는 「자본시장과 금융투자업에 관한 법률」
            제6조에 따른 투자자문업자가 아니며, 본 서비스는 동법에서 규정하는 투자자문 또는
            투자일임에 해당하지 않습니다.
          </li>
          <li>
            <strong>정보의 한계</strong>: 본 결과는 15개의 주관적 응답을 바탕으로 산출된 성향
            분류로, 개인의 실제 투자 적합성, 재무 상태, 투자 목적을 반영하지 않습니다.
          </li>
          <li>
            <strong>투자 손실 위험</strong>: 주식, ETF 등 금융투자상품은 원금 손실 위험이 있으며,
            과거 수익률이 미래 수익을 보장하지 않습니다.
          </li>
          <li>
            <strong>책임 제한</strong>: 공시공시는 본 서비스 이용으로 인해 발생한 직·간접적 투자
            손실에 대해 어떠한 법적·도의적 책임도 부담하지 않습니다.
          </li>
        </ol>
        <p className="mt-2">
          실제 투자 전 금융감독원 등록 투자자문사 또는 금융기관과 상담하시기 바랍니다.
        </p>
      </div>
    </div>
  )
}
