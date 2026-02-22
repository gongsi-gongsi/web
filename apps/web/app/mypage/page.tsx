import type { Metadata } from 'next'

import { MypagePage } from '@/widgets/mypage'

export const metadata: Metadata = {
  title: '마이페이지',
  description: '계정 정보 및 설정을 관리합니다',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <MypagePage />
    </main>
  )
}
