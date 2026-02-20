import type { Metadata } from 'next'

import { InterestsPage } from '@/widgets/interests-page'

export const metadata: Metadata = {
  title: '관심 종목',
  description: '내가 등록한 관심 종목 목록',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <InterestsPage />
    </main>
  )
}
