import { Suspense } from 'react'

import { LoginForm } from '@/widgets/auth'

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pb-24 md:pb-0">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
