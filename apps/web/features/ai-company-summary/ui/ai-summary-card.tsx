'use client'

import { Card, CardContent } from '@gs/ui'
import { useAiCompanySummary } from '../queries/hooks'

interface AiSummaryCardProps {
  corpCode: string
}

/**
 * ISO 날짜 문자열을 "YYYY.MM.DD HH:mm" 형식으로 변환합니다
 */
function formatGeneratedAt(isoString: string): string {
  const d = new Date(isoString)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${day} ${h}:${min}`
}

function SectionTitle() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base font-semibold">AI 기업 분석</span>
      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
        Beta
      </span>
    </div>
  )
}

function ShimmerLine({ width }: { width: string }) {
  return <div className={`ai-shimmer-line h-4 ${width}`} />
}

function SummaryShimmer() {
  return (
    <>
      <div className="space-y-1.5">
        <ShimmerLine width="w-full" />
        <ShimmerLine width="w-full" />
        <ShimmerLine width="w-3/5" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground/60">분석 중...</p>
    </>
  )
}

/**
 * AI 기업 요약 카드
 * 클라이언트 마운트 후 Gemini Flash로 생성한 통합 기업 분석 요약을 표시합니다
 * 로딩 중에는 타이틀 + 시머 애니메이션, 에러 시 카드 자체를 숨깁니다
 */
export function AiSummaryCard({ corpCode }: AiSummaryCardProps) {
  const { data, isLoading, isError } = useAiCompanySummary(corpCode)

  if (isError) return null

  const generatedDate = data ? formatGeneratedAt(data.generatedAt) : null

  return (
    <>
      {/* 모바일 */}
      <div className="px-4 md:hidden">
        <div className="mb-2">
          <SectionTitle />
        </div>
        {isLoading || !data ? (
          <SummaryShimmer />
        ) : (
          <>
            <p className="text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              AI가 생성한 요약이며 투자 권유가 아닙니다. 투자 책임은 본인에게 있습니다 ·{' '}
              {generatedDate}
            </p>
          </>
        )}
      </div>

      {/* PC */}
      <div className="hidden md:block">
        <Card>
          <CardContent>
            <div className="mb-3">
              <SectionTitle />
            </div>
            {isLoading || !data ? (
              <SummaryShimmer />
            ) : (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
                <p className="mt-3 text-xs text-muted-foreground/60">
                  AI가 생성한 요약이며 투자 권유가 아닙니다. 투자 책임은 본인에게 있습니다 ·{' '}
                  {generatedDate}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
