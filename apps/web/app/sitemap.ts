import type { MetadataRoute } from 'next'
import { prisma } from '@/shared/lib/prisma'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://gongsi-gongsi.kr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/disclosures/today`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interests`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // 동적 페이지: 기업 상세
  const stocks = await prisma.stock.findMany({
    select: { corpCode: true, updatedAt: true },
  })

  const companyPages: MetadataRoute.Sitemap = stocks.map(stock => ({
    url: `${BASE_URL}/companies/${stock.corpCode}`,
    lastModified: stock.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...companyPages]
}
