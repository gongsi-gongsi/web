import type { Metadata } from 'next'
import { ThemeProvider } from '@gs/ui'
import './globals.css'

export const metadata: Metadata = {
  title: '공시공시 Admin - 관리자 페이지',
  description: '공시공시 관리자 페이지',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
