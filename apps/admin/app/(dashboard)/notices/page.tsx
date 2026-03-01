import Link from 'next/link'
import { Button } from '@gs/ui'
import { NoticeListWidget } from '@/widgets/notice-list'

export default function NoticesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Button asChild>
          <Link href="/notices/new">새 공지사항 작성</Link>
        </Button>
      </div>
      <NoticeListWidget />
    </div>
  )
}
