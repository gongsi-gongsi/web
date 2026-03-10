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

  async function handleShare() {
    const shareUrl = `${window.location.origin}/economic-quiz/result/${result.tier}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('링크가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  const scorePercent = Math.round((result.score / result.total) * 100)

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 메인 결과 카드 */}
      <div className="overflow-hidden rounded-3xl bg-card shadow-md">
        {/* 헤더 */}
        <div className="relative flex flex-col items-center bg-gradient-to-b from-primary/10 to-transparent px-6 pb-8 pt-10">
          {/* 이모지 */}
          <div className="mb-4 flex size-28 items-center justify-center rounded-full bg-background shadow-lg">
            <span className="text-6xl" role="img" aria-label={tierData.name}>
              {tierData.emoji}
            </span>
          </div>

          {/* 티어 배지 */}
          <span
            className={`mb-2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ${tierData.color}`}
          >
            {result.tier}
          </span>

          <h1 className="text-3xl font-black text-foreground">{tierData.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tierData.description}</p>

          {/* 점수 */}
          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-5xl font-black text-primary">{result.score}</span>
            <span className="text-xl font-semibold text-muted-foreground">/{result.total}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">정답률 {scorePercent}%</p>
        </div>

        {/* 본문 */}
        <div className="flex flex-col gap-6 p-6">
          {/* 카테고리별 점수 */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              카테고리별 정답률
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
