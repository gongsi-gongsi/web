'use client'

import Link from 'next/link'

import { Button } from '@gs/ui'
import { ArrowCounterClockwiseIcon, LinkIcon } from '@phosphor-icons/react/dist/ssr'
import { toast } from 'sonner'

import { TIERS_MAP } from '../data/tiers'
import type { QuizCategory, QuizResult } from '../types'
import { CategoryScoreBar } from './category-score-bar'

interface ResultCardProps {
  result: QuizResult
  onReset?: () => void
}

const CATEGORY_ORDER: QuizCategory[] = ['STOCK', 'ECONOMY', 'BOND', 'FUND', 'DERIVATIVE']

export function ResultCard({ result, onReset }: ResultCardProps) {
  const tierData = TIERS_MAP[result.tier]
  const scorePercent = Math.round((result.score / result.total) * 100)

  async function handleShare() {
    const shareUrl = `${window.location.origin}/economic-quiz/result/${result.tier}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('링크가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 메인 결과 카드 */}
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-4 border-b border-border/60 px-6 py-8">
          {/* 이모지 */}
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
            <span className="relative text-6xl" role="img" aria-label={tierData.name}>
              {tierData.emoji}
            </span>
          </div>

          {/* 티어 배지 */}
          <span
            className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ${tierData.color}`}
          >
            {result.tier}
          </span>

          <div className="text-center">
            <h1 className="text-2xl font-black text-foreground">{tierData.name}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {tierData.description}
            </p>
          </div>

          {/* 점수 */}
          <div className="flex w-full items-center justify-center divide-x divide-border rounded-xl border border-border/60 bg-muted/30 py-4">
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-3xl font-black text-foreground">
                {result.score}
                <span className="text-lg font-semibold text-muted-foreground">/{result.total}</span>
              </span>
              <span className="text-xs text-muted-foreground">정답 수</span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-3xl font-black text-primary">{scorePercent}%</span>
              <span className="text-xs text-muted-foreground">정답률</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* 카테고리별 점수 */}
          <div>
            <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              CATEGORY STATS
            </p>
            <div className="flex flex-col gap-4">
              {CATEGORY_ORDER.map(category => {
                const score = result.categoryScores[category]
                if (!score || score.total === 0) return null
                return (
                  <CategoryScoreBar
                    key={category}
                    category={category}
                    correct={score.correct}
                    total={score.total}
                  />
                )
              })}
            </div>
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
                다시 풀기
              </Button>
            ) : (
              <Button asChild variant="outline" className="relative flex-1 justify-center">
                <Link href="/economic-quiz">
                  <ArrowCounterClockwiseIcon className="absolute left-4 size-4" />
                  다시 풀기
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
