import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Providers } from './providers'
import { Header } from '@/widgets/header'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <body className="bg-background text-foreground antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
