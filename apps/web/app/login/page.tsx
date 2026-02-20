import { Suspense } from 'react'
import type { Metadata } from 'next'

import { LoginForm } from '@/widgets/auth'

export const metadata: Metadata = {
  title: '로그인',
  description: '공시공시에 로그인하여 맞춤 서비스를 이용하세요',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pb-24 md:pb-0">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
