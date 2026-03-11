export type QuizCategory = 'STOCK' | 'BOND' | 'ECONOMY' | 'FUND' | 'DERIVATIVE'

export interface QuizQuestion {
  id: number
  category: QuizCategory
  question: string
  options: [string, string, string, string]
  answer: number // 정답 인덱스 (0~3)
  explanation: string
}

export type TierType = 'BEGINNER' | 'AMATEUR' | 'INVESTOR' | 'EXPERT' | 'MASTER' | 'LEGEND'

export interface TierData {
  type: TierType
  name: string
  minScore: number
  maxScore: number
  description: string
  emoji: string
  color: string
}

export interface CategoryScore {
  correct: number
  total: number
}

export interface QuizResult {
  tier: TierType
  score: number
  total: number
  categoryScores: Record<QuizCategory, CategoryScore>
}

export interface QuizState {
  step: 'intro' | 'quiz' | 'loading' | 'result'
  selectedQuestions: QuizQuestion[]
  currentIndex: number
  answers: Record<number, number> // questionIndex → 선택한 옵션 인덱스
  result: QuizResult | null
}
