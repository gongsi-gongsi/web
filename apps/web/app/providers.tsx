'use client'

import { lazy, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@gs/ui'
import { getQueryClient } from '@/shared/lib/query'

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then(m => ({
    default: m.ReactQueryDevtools,
  }))
)

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </Suspense>
      )}
    </QueryClientProvider>
  )
}
