import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Providers } from './providers'
import { Header } from '@/widgets/header'
import { BottomNav } from '@/widgets/bottom-nav'
import './globals.css'

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '공시공시',
  description: 'AI 기반 기업 공시 분석 서비스',
}

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <body className="bg-background text-foreground antialiased">
        <Providers>
          <Header />
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
