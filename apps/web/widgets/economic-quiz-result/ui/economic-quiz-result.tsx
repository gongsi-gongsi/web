'use client'

import { useEffect, useState } from 'react'

import { TIERS_MAP, ResultCard } from '@/features/economic-quiz'
import type { QuizResult, TierType } from '@/features/economic-quiz'
import { MobileHeader } from '@/widgets/header'

interface EconomicQuizResultProps {
  /** 서버 컴포넌트에서 isTierType()으로 검증된 티어 타입 */
  tier: TierType
}

/**
 * 티어로부터 기본 결과를 생성합니다.
 * 공유 링크로 직접 접근 시 사용합니다.
 * @param tier - 유효한 TierType
 */
function getDefaultResult(tier: TierType): QuizResult {
  const tierData = TIERS_MAP[tier]
  const midScore = Math.round((tierData.minScore + tierData.maxScore) / 2)

  return {
    tier,
    score: midScore,
    total: 20,
    categoryScores: {
      STOCK: { correct: 0, total: 0 },
      ECONOMY: { correct: 0, total: 0 },
      BOND: { correct: 0, total: 0 },
      FUND: { correct: 0, total: 0 },
      DERIVATIVE: { correct: 0, total: 0 },
    },
  }
}

export function EconomicQuizResult({ tier }: EconomicQuizResultProps) {
  const [result, setResult] = useState<QuizResult>(() => getDefaultResult(tier))

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('economic_quiz_result')
      if (!stored) return

      const parsed: unknown = JSON.parse(stored)

      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'tier' in parsed &&
        'score' in parsed &&
        (parsed as { tier: unknown }).tier === tier
      ) {
        setResult(parsed as QuizResult)
        sessionStorage.removeItem('economic_quiz_result')
      }
    } catch {
      // sessionStorage 접근 불가 또는 파싱 오류 시 기본값 유지
    }
  }, [tier])

  return (
    <>
      <MobileHeader />
      <main className="min-h-[calc(100dvh-3.5rem)] px-4 py-6 pb-24 md:pb-8">
        <div className="mx-auto max-w-lg">
          <ResultCard result={result} />
        </div>
      </main>
    </>
  )
}
