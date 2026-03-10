import type { Metadata } from 'next'

import { WebApplicationJsonLd } from '@/shared/lib/seo'
import { CompoundCalculator } from '@/widgets/compound-calculator'
import { MobileHeader } from '@/widgets/header'

export const metadata: Metadata = {
  title: '복리 계산기',
  description:
    '원금과 월 적립금, 연이율, 기간을 입력하면 복리의 마법으로 미래 자산을 계산해드려요. 연도별 자산 성장 추이를 한눈에 확인하세요.',
  keywords: [
    '복리 계산기',
    '복리 계산',
    '투자 수익 계산',
    '자산 계산기',
    '월 적립 복리',
    '재테크 계산기',
  ],
  openGraph: {
    title: '복리 계산기 — 미래 자산을 계산해보세요',
    description: '원금·월적립금·연이율·기간으로 복리 수익을 시각화합니다.',
    url: 'https://gongsi-gongsi.kr/calculator',
  },
  alternates: {
    canonical: 'https://gongsi-gongsi.kr/calculator',
  },
}

export default function CalculatorPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="복리 계산기"
        description="원금과 월 적립금, 연이율, 기간을 입력하면 복리의 마법으로 미래 자산을 계산해드려요."
        url="https://gongsi-gongsi.kr/calculator"
      />
      <MobileHeader />
      <main className="mx-auto max-w-lg px-4 py-8 pb-28 md:max-w-3xl md:py-14 md:pb-14">
        <div className="mb-7">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="text-2xl font-black tracking-tight text-foreground">복리 계산기</h1>
          </div>
          <p className="text-sm text-muted-foreground">복리의 마법으로 미래 자산을 계산해요.</p>
        </div>
        <CompoundCalculator />
      </main>
    </>
  )
}
