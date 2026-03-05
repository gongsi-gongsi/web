import type { Metadata } from 'next'

import { InvestmentMbtiQuiz } from '@/widgets/investment-mbti-quiz'

export const metadata: Metadata = {
  title: '투자성향 진단 중',
  description: '15개 질문으로 나의 투자성향을 진단하고 있습니다.',
  robots: { index: false },
}

export default function QuizPage() {
  return <InvestmentMbtiQuiz />
}
