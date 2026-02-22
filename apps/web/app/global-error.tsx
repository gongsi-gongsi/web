'use client'

import { useEffect } from 'react'

import * as Sentry from '@sentry/nextjs'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-6xl font-bold">500</p>
          <h1 className="text-xl font-semibold">심각한 오류가 발생했습니다</h1>
          <p className="text-sm text-gray-500">
            서비스에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          다시 시도
        </button>
      </body>
    </html>
  )
}
