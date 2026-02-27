import Link from 'next/link'
import { Button } from '@gs/ui'
import { BannerListWidget } from '@/widgets/banner-list'

export default function BannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">배너 관리</h1>
        <Button asChild>
          <Link href="/banners/new">새 배너 추가</Link>
        </Button>
      </div>
      <BannerListWidget />
    </div>
  )
}
