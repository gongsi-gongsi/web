import type { Metadata } from 'next'

import { WebApplicationJsonLd } from '@/shared/lib/seo'
import { InvestmentMbtiLanding } from '@/widgets/investment-mbti-landing'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '투자성향 MBTI',
  description:
    '15개 질문으로 알아보는 나만의 투자성향 MBTI. 수익추구형 vs 안정추구형, 단기매매형 vs 장기투자형 등 4가지 축으로 16가지 투자 유형 중 나의 유형을 찾아보세요.',
  keywords: [
    '투자성향 테스트',
    '투자 MBTI',
    '투자 유형',
    '주식 투자 성향',
    '투자 성격 테스트',
    '개인 투자자',
  ],
  openGraph: {
    title: '나의 투자 유형은? — 투자성향 MBTI',
    description:
      '15개 질문으로 알아보는 나만의 투자성향 MBTI. 16가지 유형 중 나의 투자 스타일을 발견하세요.',
    url: 'https://gongsi-gongsi.kr/investment-mbti',
  },
  alternates: {
    canonical: 'https://gongsi-gongsi.kr/investment-mbti',
  },
}

export default function InvestmentMbtiPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="투자성향 MBTI"
        description="15개 질문으로 알아보는 나만의 투자성향 MBTI. 16가지 투자 유형 중 나의 스타일을 발견하세요."
        url="https://gongsi-gongsi.kr/investment-mbti"
        applicationCategory="GameApplication"
      />
      <InvestmentMbtiLanding />
    </>
  )
}
