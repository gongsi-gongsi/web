'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@gs/ui'
import { Toaster } from 'sonner'
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
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
