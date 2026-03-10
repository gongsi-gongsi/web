import type { Metadata } from 'next'

import { EconomicQuizQuiz } from '@/widgets/economic-quiz-quiz'

export const metadata: Metadata = {
  title: '경제 용어 퀴즈 진행 중',
  robots: { index: false },
}

export default function EconomicQuizQuizPage() {
  return <EconomicQuizQuiz />
}
