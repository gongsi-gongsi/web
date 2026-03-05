import type { Metadata } from 'next'

import { InvestmentMbtiLanding } from '@/widgets/investment-mbti-landing'

export const metadata: Metadata = {
  title: '투자성향 MBTI',
  description:
    '15개 질문으로 알아보는 나만의 투자성향 MBTI. 수익추구형 vs 안정추구형, 단기매매형 vs 장기투자형 등 4가지 축으로 16가지 투자 유형 중 나의 유형을 찾아보세요.',
  openGraph: {
    title: '나의 투자 유형은? — 투자성향 MBTI',
    description: '15개 질문으로 알아보는 나만의 투자성향 MBTI',
  },
}

export default function InvestmentMbtiPage() {
  return <InvestmentMbtiLanding />
}
