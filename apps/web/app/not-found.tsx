import Link from 'next/link'

import { Button } from '@gs/ui'

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-4 pb-24 md:pb-0">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-6xl font-bold">404</p>
        <h1 className="text-xl font-semibold">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
      </div>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </main>
  )
}
