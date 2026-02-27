import { NoticeForm } from '@/features/notice-form'

export default function NewNoticePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">새 공지사항 작성</h1>
      <NoticeForm />
    </div>
  )
}
