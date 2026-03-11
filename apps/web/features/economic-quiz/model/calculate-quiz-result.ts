import { getTierByScore } from '../data/tiers'
import type { QuizCategory, QuizQuestion, QuizResult } from '../types'

/**
 * 퀴즈 결과를 계산합니다.
 *
 * @param questions - 출제된 문제 배열
 * @param answers - 질문 인덱스를 키, 선택한 옵션 인덱스를 값으로 갖는 답변 맵
 * @returns 점수, 티어, 카테고리별 정답률을 포함한 결과 객체
 *
 * @example
 * calculateQuizResult(questions, { 0: 2, 1: 0, ... })
 * // { tier: 'EXPERT', score: 14, total: 20, categoryScores: { ... } }
 */
export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: Record<number, number>
): QuizResult {
  const categoryScores: Record<QuizCategory, { correct: number; total: number }> = {
    STOCK: { correct: 0, total: 0 },
    BOND: { correct: 0, total: 0 },
    ECONOMY: { correct: 0, total: 0 },
    FUND: { correct: 0, total: 0 },
    DERIVATIVE: { correct: 0, total: 0 },
  }

  let totalScore = 0

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    if (!question) continue

    const { category, answer } = question
    categoryScores[category].total += 1

    if (answers[i] === answer) {
      totalScore += 1
      categoryScores[category].correct += 1
    }
  }

  const tier = getTierByScore(totalScore)

  return {
    tier,
    score: totalScore,
    total: questions.length,
    categoryScores,
  }
}
