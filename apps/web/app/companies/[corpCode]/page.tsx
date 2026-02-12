import { notFound } from 'next/navigation'
import { CompanyDetailPage } from '@/widgets/company-detail-page'

interface CompanyDetailPageProps {
  params: Promise<{ corpCode: string }>
}

export default async function CompanyDetailRoute({ params }: CompanyDetailPageProps) {
  const { corpCode } = await params

  // corpCode 유효성 검사
  if (!/^[0-9]{8}$/.test(corpCode)) {
    notFound()
  }

  return (
    <main className="bg-background min-h-screen">
      <CompanyDetailPage corpCode={corpCode} />
    </main>
  )
}
