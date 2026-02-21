import type { Metadata } from 'next'

import { TermsPage } from '@/widgets/legal-page'

export const metadata: Metadata = {
  title: '이용약관',
  description: '공시공시 서비스의 이용약관입니다.',
}

export default function Terms() {
  return <TermsPage />
}
