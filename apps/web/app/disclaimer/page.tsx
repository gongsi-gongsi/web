import type { Metadata } from 'next'

import { DisclaimerPage } from '@/widgets/legal-page'

export const metadata: Metadata = {
  title: '투자 면책 고지',
  description:
    '공시공시 서비스는 투자자문업에 해당하지 않으며, AI 분석 결과는 투자 권유가 아닙니다.',
}

export default function Disclaimer() {
  return <DisclaimerPage />
}
