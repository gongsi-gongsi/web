import type { Metadata } from 'next'

import { PlayLanding } from '@/widgets/play-landing'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '놀이터',
  description:
    '투자 성향 테스트, 경제 용어 퀴즈, 복리 계산기까지. 투자와 경제를 재미있게 공부하는 공간입니다.',
  keywords: ['투자 성향 테스트', '경제 퀴즈', '복리 계산기', '투자 공부', '금융 학습', '주식 공부'],
  openGraph: {
    title: '놀이터 — 투자와 경제를 재미있게',
    description: '투자 성향 테스트·경제 용어 퀴즈·복리 계산기로 투자 실력을 키워보세요.',
    url: 'https://gongsi-gongsi.kr/play',
  },
  alternates: {
    canonical: 'https://gongsi-gongsi.kr/play',
  },
}

export default function PlayPage() {
  return <PlayLanding />
}
