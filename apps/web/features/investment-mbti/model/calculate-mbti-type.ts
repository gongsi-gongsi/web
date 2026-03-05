import { QUESTIONS } from '../data/questions'
import type { Tendency } from '../data/questions'
import type { MbtiType } from '../data/mbti-types'

export type { MbtiType }

export interface AxisScores {
  G: number
  V: number
  S: number
  L: number
  F: number
  T: number
  R: number
  I: number
}

export interface AxisPercentages {
  GV: { G: number; V: number }
  SL: { S: number; L: number }
  FT: { F: number; T: number }
  RI: { R: number; I: number }
}

export interface MbtiResult {
  type: MbtiType
  scores: AxisScores
  percentages: AxisPercentages
}

/**
 * 투자성향 MBTI 결과를 계산합니다.
 *
 * @param answers - 질문 인덱스(0-14)를 키로, 'A' 또는 'B'를 값으로 가지는 답변 맵
 * @returns 유형 코드, 축별 점수, 축별 성향 강도(%)
 *
 * @example
 * calculateMbtiType({ 0: 'A', 1: 'B', ... })
 * // { type: 'GSFR', scores: { G: 5, V: 1, ... }, percentages: { GV: { G: 83, V: 17 }, ... } }
 */
export function calculateMbtiType(answers: Record<number, 'A' | 'B'>): MbtiResult {
  const scores: AxisScores = { G: 0, V: 0, S: 0, L: 0, F: 0, T: 0, R: 0, I: 0 }

  // 답변에 따라 점수 집계
  for (const [indexStr, choice] of Object.entries(answers)) {
    const index = Number(indexStr)
    const question = QUESTIONS[index]
    if (!question) continue

    const option = question.options[choice]
    const tendency = option.tendency
    scores[tendency] += option.score
  }

  // 각 축별 우세 성향 결정 (동점 시 핵심 질문 우선)
  const axis1 = resolveAxis(scores.G, scores.V, 'G' as const, 'V' as const, answers, 0)
  const axis2 = resolveAxis(scores.S, scores.L, 'S' as const, 'L' as const, answers, 4)
  const axis3 = resolveAxis(scores.F, scores.T, 'F' as const, 'T' as const, answers, 8)
  const axis4 = resolveAxis(scores.R, scores.I, 'R' as const, 'I' as const, answers, 11)

  // axis1-4는 각각 Tendency 리터럴 타입이므로 조합은 항상 유효한 MbtiType
  const type = `${axis1}${axis2}${axis3}${axis4}` as MbtiType

  const percentages = calculatePercentages(scores)

  return { type, scores, percentages }
}

/**
 * 한 축에서 우세한 성향을 결정합니다. 동점 시 핵심 질문 응답을 우선합니다.
 *
 * @param scoreA - 첫 번째 성향 점수 (예: G)
 * @param scoreB - 두 번째 성향 점수 (예: V)
 * @param tendencyA - 첫 번째 성향 코드 (예: 'G')
 * @param tendencyB - 두 번째 성향 코드 (예: 'V')
 * @param answers - 전체 답변 맵
 * @param keyQuestionIndex - 동점 시 우선 적용할 핵심 질문 인덱스 (0-based)
 * @returns 우세한 성향 코드
 */
function resolveAxis<T extends Tendency>(
  scoreA: number,
  scoreB: number,
  tendencyA: T,
  tendencyB: T,
  answers: Record<number, 'A' | 'B'>,
  keyQuestionIndex: number
): T {
  if (scoreA > scoreB) return tendencyA
  if (scoreB > scoreA) return tendencyB

  // 동점: 핵심 질문(A = tendencyA, B = tendencyB) 응답 우선
  const keyAnswer = answers[keyQuestionIndex]
  return keyAnswer === 'A' ? tendencyA : tendencyB
}

/**
 * 각 축별 성향 강도를 퍼센트로 계산합니다.
 *
 * @param scores - 축별 원점수
 * @returns 각 축의 두 성향에 대한 퍼센트 (합계 100%)
 */
function calculatePercentages(scores: AxisScores): AxisPercentages {
  const calcPercent = (a: number, b: number) => {
    const total = a + b
    if (total === 0) return { first: 50, second: 50 }
    const firstPercent = Math.round((a / total) * 100)
    return { first: firstPercent, second: 100 - firstPercent }
  }

  const gv = calcPercent(scores.G, scores.V)
  const sl = calcPercent(scores.S, scores.L)
  const ft = calcPercent(scores.F, scores.T)
  const ri = calcPercent(scores.R, scores.I)

  return {
    GV: { G: gv.first, V: gv.second },
    SL: { S: sl.first, L: sl.second },
    FT: { F: ft.first, T: ft.second },
    RI: { R: ri.first, I: ri.second },
  }
}
