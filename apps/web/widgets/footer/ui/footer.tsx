import Link from 'next/link'

export function Footer() {
  return (
    <footer className="pb-24 md:pb-0" style={{ backgroundColor: '#0c202d' }}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 브랜드 */}
        <div className="mb-6">
          <p className="text-lg font-bold text-white">공시공시</p>
          <p className="mt-0.5 text-xs text-white/70">실시간 공시·뉴스 분석 서비스</p>
        </div>

        {/* 구분선 */}
        <div className="mb-5 border-t border-white/10" />

        {/* 하단 */}
        <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="법적 고지">
            <Link href="/notices" className="text-white/70 transition-colors hover:text-white">
              공지사항
            </Link>
            <Link href="/privacy" className="text-white/70 transition-colors hover:text-white">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-white/70 transition-colors hover:text-white">
              이용약관
            </Link>
            <Link href="/disclaimer" className="text-white/70 transition-colors hover:text-white">
              투자 면책 고지
            </Link>
          </nav>
          <p className="text-white/50">
            &copy; {new Date().getFullYear()} 공시공시. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
