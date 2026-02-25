import Link from 'next/link'
import { Button } from '@gs/ui'

export function TodayDisclosuresFooter() {
  return (
    <>
      {/* PC 더보기 */}
      <div className="mt-6 hidden justify-center md:flex">
        <Link href="/disclosures/today">
          <Button variant="outline" size="sm" className="rounded-full px-6">
            전체 공시 보기
          </Button>
        </Link>
      </div>

      {/* 모바일 더보기 */}
      <div className="bg-card px-4 py-3 md:hidden">
        <Link href="/disclosures/today" className="block">
          <Button variant="outline" size="sm" className="h-11 w-full rounded-xl text-sm">
            전체 공시 보기
          </Button>
        </Link>
      </div>
    </>
  )
}
