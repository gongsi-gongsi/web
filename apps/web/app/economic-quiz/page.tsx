import type { Metadata } from 'next'

import { WebApplicationJsonLd } from '@/shared/lib/seo'
import { EconomicQuizLanding } from '@/widgets/economic-quiz-landing'

export const metadata: Metadata = {
  title: '경제 용어 퀴즈',
  description:
    '주식·채권·경제·펀드·파생상품 5개 분야 100문제 중 랜덤 20문제! 나의 금융 지식 레벨을 확인해보세요.',
  keywords: [
    '경제 용어 퀴즈',
    '금융 상식 퀴즈',
    '주식 용어',
    '재테크 공부',
    '투자 지식 테스트',
    '금융 퀴즈',
  ],
  openGraph: {
    title: '나의 금융 지식 레벨은? — 경제 용어 퀴즈',
    description: '주식·채권·경제·펀드·파생상품 20문제로 알아보는 나의 투자 지식 티어',
    url: 'https://gongsi-gongsi.kr/economic-quiz',
  },
  alternates: {
    canonical: 'https://gongsi-gongsi.kr/economic-quiz',
  },
}

export default function EconomicQuizPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="경제 용어 퀴즈"
        description="주식·채권·경제·펀드·파생상품 5개 분야 100문제 중 랜덤 20문제. 나의 금융 지식 레벨을 확인하세요."
        url="https://gongsi-gongsi.kr/economic-quiz"
        applicationCategory="GameApplication"
      />
      <EconomicQuizLanding />
    </>
  )
}
