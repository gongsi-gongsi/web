import type { Metadata } from 'next'

import { EconomicQuizLanding } from '@/widgets/economic-quiz-landing'

export const metadata: Metadata = {
  title: '경제 용어 퀴즈',
  description:
    '주식·채권·경제·펀드·파생상품 5개 분야 100문제 중 랜덤 20문제! 나의 금융 지식 레벨을 확인해보세요.',
  openGraph: {
    title: '나의 금융 지식 레벨은? — 경제 용어 퀴즈',
    description: '주식·채권·경제·펀드·파생상품 20문제로 알아보는 나의 투자 지식 티어',
  },
}

export default function EconomicQuizPage() {
  return <EconomicQuizLanding />
}
