import type { Metadata } from 'next'

import { GlossaryPage } from '@/widgets/glossary-page'

export const metadata: Metadata = {
  title: '투자 용어집',
  description:
    '투자에 필요한 핵심 용어들을 쉽게 이해할 수 있도록 정리했습니다. PER, PBR, ROE 등 재무제표부터 공시, 거래, 채권까지 투자 용어를 한눈에 살펴보세요.',
}

/** SSG: 정적 데이터만 사용하므로 빌드 타임에 생성됩니다 */
export const dynamic = 'force-static'

export default function Page() {
  return <GlossaryPage />
}
