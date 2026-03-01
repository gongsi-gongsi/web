'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@gs/ui'
import { getQueryClient } from '@/shared/lib/query'

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
    </QueryClientProvider>
  )
}
