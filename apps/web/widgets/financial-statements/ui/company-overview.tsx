'use client'

import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '@gs/ui'
import { useCompanyInfo } from '@/entities/company'
import type { CompanyInfo } from '@/entities/company'

interface CompanyOverviewProps {
  corpCode: string
}

/**
 * 시장구분 코드를 한글로 변환합니다
 */
function getMarketLabel(corpCls: CompanyInfo['corpCls']): string {
  switch (corpCls) {
    case 'Y':
      return '유가증권'
    case 'K':
      return '코스닥'
    case 'N':
      return '코넥스'
    case 'E':
      return '기타'
    default:
      return '-'
  }
}

/**
 * 설립일을 포맷팅합니다 (YYYYMMDD -> YYYY.MM.DD)
 */
function formatEstablishedDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return '-'
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`
}

interface InfoRowProps {
  label: string
  value: string
  isLink?: boolean
}

function InfoRow({ label, value, isLink }: InfoRowProps) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      {isLink && value !== '-' ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm">{value}</span>
      )}
    </div>
  )
}

/**
 * 기업 개요 컴포넌트
 * 기업의 기본 정보(대표자, 시장구분, 설립일, 주소, 홈페이지)를 표시합니다
 * @param corpCode - 기업 고유번호 (8자리)
 */
export function CompanyOverview({ corpCode }: CompanyOverviewProps) {
  const { data: companyInfo } = useCompanyInfo(corpCode)

  if (!companyInfo) {
    return null
  }

  const infoItems: InfoRowProps[] = [
    { label: '대표이사', value: companyInfo.ceoName || '-' },
    { label: '시장구분', value: getMarketLabel(companyInfo.corpCls) },
    { label: '설립일', value: formatEstablishedDate(companyInfo.establishedDate) },
    { label: '주소', value: companyInfo.address || '-' },
    { label: '홈페이지', value: companyInfo.homepage || '-', isLink: true },
  ]

  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <div className="mb-3 px-4">
          <h3 className="text-base font-semibold">기업 개요</h3>
        </div>
        <div className="divide-border divide-y px-4">
          {infoItems.map(item => (
            <InfoRow key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* PC: 카드 형태 */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>기업 개요</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-border divide-y">
              {infoItems.map(item => (
                <InfoRow key={item.label} {...item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

/**
 * 기업 개요 스켈레톤 컴포넌트
 */
export function CompanyOverviewSkeleton() {
  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <div className="mb-3 px-4">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-3 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* PC */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
