'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button, cn } from '@gs/ui'
import { ArrowCounterClockwiseIcon, LinkIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

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
      <div className="overflow-hidden rounded-3xl bg-card shadow-md">
        {/* 헤더 */}
        <div
          className={cn(
            'relative flex flex-col items-center px-6 pb-8 pt-10',
            typeData.themeColor,
            'bg-opacity-10'
          )}
        >
          {/* 캐릭터 이미지 */}
          <div className="mb-4 flex size-48 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg dark:bg-card">
            {!imgError ? (
              <Image
                src={typeData.imagePath}
                alt={typeData.name}
                width={192}
                height={192}
                className="object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-7xl" role="img" aria-label={typeData.name}>
                {typeData.emoji}
              </span>
            )}
          </div>

          {/* 유형 코드 */}
          <div className="mb-1 flex items-center gap-2">
            {Array.from(result.type).map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="flex size-12 items-center justify-center rounded-2xl bg-background/80 text-xl font-black text-foreground shadow-sm backdrop-blur-sm"
              >
                {char}
              </span>
            ))}
          </div>

          <h1 className="mt-2 text-2xl font-black text-foreground">{typeData.name}</h1>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">{typeData.subtitle}</p>
          <p className="mt-3 text-center text-sm italic text-muted-foreground">
            &ldquo;{typeData.tagline}&rdquo;
          </p>
        </div>

        {/* 본문 */}
        <div className="flex flex-col gap-6 p-6">
          {/* 설명 */}
          <p className="text-sm leading-relaxed text-secondary-foreground">
            {typeData.description}
          </p>

          {/* 성향 강도 */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              성향 강도
            </p>
            <div className="flex flex-col gap-5">
              <TendencyBar
                axisLabel={AXIS_LABELS.GV}
                leftLetter="G"
                leftLabel="수익추구형"
                leftPercent={result.percentages.GV.G}
                rightLetter="V"
                rightLabel="안정추구형"
                rightPercent={result.percentages.GV.V}
              />
              <TendencyBar
                axisLabel={AXIS_LABELS.SL}
                leftLetter="S"
                leftLabel="단기매매형"
                leftPercent={result.percentages.SL.S}
                rightLetter="L"
                rightLabel="장기투자형"
                rightPercent={result.percentages.SL.L}
              />
              <TendencyBar
                axisLabel={AXIS_LABELS.FT}
                leftLetter="F"
                leftLabel="펀더멘털형"
                leftPercent={result.percentages.FT.F}
                rightLetter="T"
                rightLabel="기술적분석형"
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

          {/* 축별 성향 설명 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              성향 분석
            </p>
            <div className="flex flex-col gap-4">
              {(Array.from(result.type) as Tendency[]).map(tendency => {
                const info = TENDENCY_INFO[tendency]
                const percent = axisPercentMap[tendency]
                return (
                  <div key={tendency} className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                      {tendency}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-foreground">{info.label}</span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {percent}%
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
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
            <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                강점
              </p>
              <ul className="space-y-1.5">
                {typeData.strengths.map(s => (
                  <li
                    key={s}
                    className="flex items-start gap-1.5 text-xs text-emerald-800 dark:text-emerald-300"
                  >
                    <span className="mt-0.5 shrink-0">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                약점
              </p>
              <ul className="space-y-1.5">
                {typeData.weaknesses.map(w => (
                  <li
                    key={w}
                    className="flex items-start gap-1.5 text-xs text-rose-800 dark:text-rose-300"
                  >
                    <span className="mt-0.5 shrink-0">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 투자 경향 */}
          <div className="rounded-2xl bg-primary/5 p-4 dark:bg-primary/10">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary/80">
              이 성향의 투자자들이 주로 관심 갖는 경향
            </p>
            <p className="text-xs leading-relaxed text-foreground/70">{typeData.tendency}</p>
            <p className="mt-2 text-[10px] text-muted-foreground/60">
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
                다시 검사하기
              </Button>
            ) : (
              <Button asChild variant="outline" className="relative flex-1 justify-center">
                <Link href="/investment-mbti">
                  <ArrowCounterClockwiseIcon className="absolute left-4 size-4" />
                  다시 검사하기
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 하단 면책 공고 */}
      <div className="rounded-2xl bg-muted/50 p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p className="mb-2 font-bold text-foreground/70">[투자 위험 고지 및 면책 공고]</p>
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
