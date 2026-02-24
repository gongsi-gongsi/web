import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCompanyInfo } from '@/entities/company/api/company-info/server'
import { CompanyJsonLd } from '@/shared/lib/seo'
import { CompanyDetailPage } from '@/widgets/company-detail-page'

interface CompanyDetailPageProps {
  params: Promise<{ corpCode: string }>
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { corpCode } = await params

  if (!/^[0-9]{8}$/.test(corpCode)) {
    return { title: '기업 정보 없음' }
  }

  const companyInfo = await getCompanyInfo(corpCode)

  if (!companyInfo) {
    return { title: '기업 정보 없음' }
  }

  return {
    title: `${companyInfo.corpName} - 기업 분석`,
    description: `${companyInfo.corpName}(${companyInfo.stockCode})의 공시, 재무제표, AI 분석을 확인하세요`,
    alternates: {
      canonical: `/companies/${corpCode}`,
    },
    openGraph: {
      title: `${companyInfo.corpName} - 공시공시`,
      description: `${companyInfo.corpName} 기업 공시 및 재무 분석`,
    },
  }
}

export default async function CompanyDetailRoute({ params }: CompanyDetailPageProps) {
  const { corpCode } = await params

  if (!/^[0-9]{8}$/.test(corpCode)) {
    notFound()
  }

  const companyInfo = await getCompanyInfo(corpCode)

  return (
    <main className="bg-background min-h-screen">
      {companyInfo && (
        <CompanyJsonLd corpName={companyInfo.corpName} stockCode={companyInfo.stockCode} />
      )}
      <CompanyDetailPage corpCode={corpCode} />
    </main>
  )
}
