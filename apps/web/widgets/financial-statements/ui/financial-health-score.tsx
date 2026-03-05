'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Card, CardHeader, CardTitle, CardContent, cn } from '@gs/ui'
import { InfoIcon, XIcon } from '@phosphor-icons/react'
import { useFinancials } from '@/entities/company'
import { calculateROE, calculateOperatingMargin, calculateDebtRatio } from '../lib/format-display'

// ─── 채점 함수 ────────────────────────────────────────────────────────────────

function scoreProfitability(margin: number | null): number {
  if (margin === null) return 0
  if (margin >= 20) return 25
  if (margin >= 10) return 20
  if (margin >= 5) return 15
  if (margin >= 0) return 8
  return 0
}

function scoreGrowth(current: number | null, prev: number | null): number {
  if (current === null || prev === null || prev === 0) return 12
  const yoy = ((current - prev) / Math.abs(prev)) * 100
  if (yoy >= 20) return 25
  if (yoy >= 10) return 20
  if (yoy >= 0) return 13
  if (yoy >= -10) return 6
  return 0
}

function scoreStability(debtRatio: number | null): number {
  if (debtRatio === null) return 12
  if (debtRatio <= 50) return 25
  if (debtRatio <= 100) return 20
  if (debtRatio <= 200) return 13
  if (debtRatio <= 300) return 6
  return 0
}

function scoreEfficiency(roe: number | null): number {
  if (roe === null) return 0
  if (roe >= 20) return 25
  if (roe >= 15) return 20
  if (roe >= 10) return 15
  if (roe >= 5) return 10
  if (roe >= 0) return 5
  return 0
}

function getGrade(score: number): { label: string; color: string; bg: string } {
  if (score >= 85)
    return { label: '최상', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' }
  if (score >= 70)
    return { label: '양호', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500' }
  if (score >= 50)
    return { label: '보통', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' }
  if (score >= 30)
    return { label: '주의', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' }
  return { label: '위험', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' }
}

function getBarBg(score: number, max: number): string {
  const r = score / max
  if (r >= 0.8) return 'bg-emerald-500'
  if (r >= 0.6) return 'bg-blue-500'
  if (r >= 0.4) return 'bg-amber-500'
  if (r >= 0.2) return 'bg-orange-500'
  return 'bg-red-500'
}

// ─── 채점 기준 데이터 ─────────────────────────────────────────────────────────

const CRITERIA = [
  {
    label: '수익성',
    basis: '영업이익률',
    max: 25,
    rules: ['20% 이상 → 25점', '10–20% → 20점', '5–10% → 15점', '0–5% → 8점', '0% 미만 → 0점'],
  },
  {
    label: '성장성',
    basis: '매출 YoY',
    max: 25,
    rules: ['20% 이상 → 25점', '10–20% → 20점', '0–10% → 13점', '-10–0% → 6점', '-10% 미만 → 0점'],
  },
  {
    label: '안정성',
    basis: '부채비율',
    max: 25,
    rules: [
      '50% 이하 → 25점',
      '50–100% → 20점',
      '100–200% → 13점',
      '200–300% → 6점',
      '300% 초과 → 0점',
    ],
  },
  {
    label: '효율성',
    basis: 'ROE',
    max: 25,
    rules: [
      '20% 이상 → 25점',
      '15–20% → 20점',
      '10–15% → 15점',
      '5–10% → 10점',
      '0–5% → 5점',
      '0% 미만 → 0점',
    ],
  },
]

// ─── 채점 기준 팝오버 ─────────────────────────────────────────────────────────

function CriteriaPopover() {
  const [open, setOpen] = useState(false)
  const [flipLeft, setFlipLeft] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  function handleToggle() {
    if (open) {
      setOpen(false)
      return
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const popW = 288
      const margin = 12
      setFlipLeft(rect.left + popW > window.innerWidth - margin)
    }
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="채점 기준 보기"
      >
        <InfoIcon className="size-4" />
      </button>

      {open && (
        <div
          ref={popRef}
          className={cn(
            'absolute top-8 z-50 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl',
            flipLeft ? 'right-0' : 'left-0'
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">채점 기준</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {CRITERIA.map(c => (
              <div key={c.label}>
                <p className="mb-1 text-xs font-semibold text-foreground">
                  {c.label} ({c.max}점) · {c.basis}
                </p>
                <div className="space-y-0.5 pl-2">
                  {c.rules.map(r => (
                    <p key={r} className="text-[11px] text-muted-foreground">
                      {r}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[10px] text-muted-foreground/60">
            * 최근 연간 재무데이터 기준. 참고용이며 투자 조언이 아닙니다.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── 스코어 콘텐츠 (데이터 의존) ─────────────────────────────────────────────

function FinancialHealthScoreContent({ corpCode }: { corpCode: string }) {
  const { data } = useFinancials(corpCode, 'yearly')
  const yearly = data.data

  if (yearly.length === 0) return null

  const latest = yearly[yearly.length - 1]
  const prev = yearly.length >= 2 ? yearly[yearly.length - 2] : null

  const operatingMargin = calculateOperatingMargin(latest.operatingProfit, latest.revenue)
  const debtRatio = calculateDebtRatio(latest.totalLiabilities, latest.totalEquity)
  const roe = calculateROE(latest.netIncome, latest.totalEquity)
  const yoyGrowth =
    prev && latest.revenue && prev.revenue
      ? ((latest.revenue - prev.revenue) / Math.abs(prev.revenue)) * 100
      : null

  const profitScore = scoreProfitability(operatingMargin)
  const growthScore = scoreGrowth(latest.revenue, prev?.revenue ?? null)
  const stabilityScore = scoreStability(debtRatio)
  const efficiencyScore = scoreEfficiency(roe)
  const total = profitScore + growthScore + stabilityScore + efficiencyScore

  const grade = getGrade(total)

  const dimensions = [
    {
      label: '수익성',
      detail:
        operatingMargin !== null ? `영업이익률 ${operatingMargin.toFixed(1)}%` : '영업이익률 -',
      score: profitScore,
      max: 25,
    },
    {
      label: '성장성',
      detail:
        yoyGrowth !== null
          ? `매출 YoY ${yoyGrowth > 0 ? '+' : ''}${yoyGrowth.toFixed(1)}%`
          : '매출 YoY -',
      score: growthScore,
      max: 25,
    },
    {
      label: '안정성',
      detail: debtRatio !== null ? `부채비율 ${debtRatio.toFixed(1)}%` : '부채비율 -',
      score: stabilityScore,
      max: 25,
    },
    {
      label: '효율성',
      detail: roe !== null ? `ROE ${roe.toFixed(1)}%` : 'ROE -',
      score: efficiencyScore,
      max: 25,
    },
  ]

  return (
    <div className="space-y-5">
      {/* 총점 */}
      <div className="flex items-center gap-4">
        <div className="shrink-0 text-center">
          <div className="flex items-baseline gap-0.5">
            <span className={cn('text-4xl font-black tabular-nums', grade.color)}>{total}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <span
            className={cn(
              'mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-bold',
              grade.color,
              'bg-current/10'
            )}
            style={{ backgroundColor: undefined }}
          >
            <span className={grade.color}>{grade.label}</span>
          </span>
        </div>

        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all duration-700', grade.bg)}
              style={{ width: `${total}%` }}
            />
          </div>
        </div>
      </div>

      {/* 차원별 점수 */}
      <div className="space-y-3">
        {dimensions.map(dim => (
          <div key={dim.label} className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-xs font-medium text-foreground">{dim.label}</span>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    getBarBg(dim.score, dim.max)
                  )}
                  style={{ width: `${(dim.score / dim.max) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-24 shrink-0 text-right text-[11px] text-muted-foreground">
              {dim.detail}
            </span>
            <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums">
              {dim.score}/{dim.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 공개 컴포넌트 ────────────────────────────────────────────────────────────

interface FinancialHealthScoreProps {
  corpCode: string
}

export function FinancialHealthScore({ corpCode }: FinancialHealthScoreProps) {
  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <div className="mb-3 flex items-center gap-2 px-4">
          <h3 className="text-base font-semibold">재무 건전성</h3>
          <CriteriaPopover />
        </div>
        <div className="px-4">
          <Suspense fallback={<ScoreSkeleton />}>
            <FinancialHealthScoreContent corpCode={corpCode} />
          </Suspense>
        </div>
      </div>

      {/* PC */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              재무 건전성
              <CriteriaPopover />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ScoreSkeleton />}>
              <FinancialHealthScoreContent corpCode={corpCode} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ScoreSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-20 rounded-lg bg-muted" />
        <div className="h-3 flex-1 rounded-full bg-muted" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-12 rounded bg-muted" />
            <div className="h-2 flex-1 rounded-full bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
