import { BannerForm } from '@/features/banner-form'

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">새 배너 추가</h1>
      <BannerForm />
    </div>
  )
}
