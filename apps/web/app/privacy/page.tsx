import type { Metadata } from 'next'

import { PrivacyPage } from '@/widgets/legal-page'

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '공시공시 서비스의 개인정보처리방침입니다.',
}

export default function Privacy() {
  return <PrivacyPage />
}
