import Link from 'next/link'
import { Button } from '@gs/ui'

export function TodayDisclosuresFooter() {
  return (
    <>
      {/* PC 더보기 */}
      <div className="mt-4 hidden justify-center md:flex">
        <Link href="/disclosures/today">
          <Button variant="ghost" size="sm">
            더보기 →
          </Button>
        </Link>
      </div>

      {/* 모바일 더보기 */}
      <div className="border-t border-border bg-card md:hidden">
        <Link href="/disclosures/today" className="block">
          <Button variant="ghost" size="xl" className="h-16 w-full text-muted-foreground">
            더보기
          </Button>
        </Link>
      </div>
    </>
  )
}
