'use client'

import { useEffect, useState } from 'react'

import { MBTI_TYPES, ResultCard } from '@/features/investment-mbti'
import type { MbtiResult, MbtiType } from '@/features/investment-mbti'

interface InvestmentMbtiResultProps {
  /** 서버 컴포넌트에서 isMbtiType()으로 검증된 유형 코드 */
  type: MbtiType
}

const DEFAULT_DOMINANT_PERCENT = 60
const DEFAULT_RECESSIVE_PERCENT = 100 - DEFAULT_DOMINANT_PERCENT

/**
 * 유형 코드에서 기본 퍼센트를 생성합니다.
 * 공유 링크로 직접 접근 시 사용하며, 우세 성향을 60%로 표시합니다.
 * @param type - 유효한 MbtiType 코드
 */
function getDefaultResult(type: MbtiType): MbtiResult {
  return {
    type,
    scores: { G: 0, V: 0, S: 0, L: 0, F: 0, T: 0, R: 0, I: 0 },
    percentages: {
      GV: {
        G: type[0] === 'G' ? DEFAULT_DOMINANT_PERCENT : DEFAULT_RECESSIVE_PERCENT,
        V: type[0] === 'G' ? DEFAULT_RECESSIVE_PERCENT : DEFAULT_DOMINANT_PERCENT,
      },
      SL: {
        S: type[1] === 'S' ? DEFAULT_DOMINANT_PERCENT : DEFAULT_RECESSIVE_PERCENT,
        L: type[1] === 'S' ? DEFAULT_RECESSIVE_PERCENT : DEFAULT_DOMINANT_PERCENT,
      },
      FT: {
        F: type[2] === 'F' ? DEFAULT_DOMINANT_PERCENT : DEFAULT_RECESSIVE_PERCENT,
        T: type[2] === 'F' ? DEFAULT_RECESSIVE_PERCENT : DEFAULT_DOMINANT_PERCENT,
      },
      RI: {
        R: type[3] === 'R' ? DEFAULT_DOMINANT_PERCENT : DEFAULT_RECESSIVE_PERCENT,
        I: type[3] === 'R' ? DEFAULT_RECESSIVE_PERCENT : DEFAULT_DOMINANT_PERCENT,
      },
    },
  }
}

export function InvestmentMbtiResult({ type }: InvestmentMbtiResultProps) {
  // type은 서버 컴포넌트에서 이미 검증됨 — 여기서는 안전하게 사용 가능
  const typeData = MBTI_TYPES[type]
  const [result, setResult] = useState<MbtiResult>(() => getDefaultResult(type))

  useEffect(() => {
    // 퀴즈에서 넘어온 경우 sessionStorage에서 정확한 결과를 가져옴
    try {
      const stored = sessionStorage.getItem('mbti_result')
      if (!stored) return

      const parsed: unknown = JSON.parse(stored)

      // 기본 형태 검증
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'type' in parsed &&
        'percentages' in parsed &&
        (parsed as { type: unknown }).type === type
      ) {
        setResult(parsed as MbtiResult)
        sessionStorage.removeItem('mbti_result')
      }
    } catch {
      // sessionStorage 접근 불가 또는 파싱 오류 시 기본값 유지
    }
  }, [type])

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] px-4 py-6 pb-24 md:pb-8">
      <div className="mx-auto max-w-lg">
        <ResultCard result={result} typeData={typeData} />
      </div>
    </main>
  )
}
