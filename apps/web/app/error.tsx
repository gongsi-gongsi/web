'use client'

import { useEffect } from 'react'

import * as Sentry from '@sentry/nextjs'

import { Button } from '@gs/ui'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-4 pb-24 md:pb-0">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-6xl font-bold">500</p>
        <h1 className="text-xl font-semibold">문제가 발생했습니다</h1>
        <p className="text-muted-foreground text-sm">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <Button onClick={reset}>다시 시도</Button>
    </main>
  )
}
