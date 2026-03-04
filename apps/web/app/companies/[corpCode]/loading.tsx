import { CompanyDetailPageSkeleton } from '@/widgets/company-detail-page'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true">
      <CompanyDetailPageSkeleton />
    </main>
  )
}
