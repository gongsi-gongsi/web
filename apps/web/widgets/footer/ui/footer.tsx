import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-border text-muted-foreground border-t pb-24 md:pb-0">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 text-xs sm:flex-row sm:justify-between">
        <nav className="flex gap-4" aria-label="법적 고지">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            이용약관
          </Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} 공시공시. All rights reserved.</p>
      </div>
    </footer>
  )
}
