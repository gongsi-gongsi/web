'use client'

import { cn } from '@gs/ui'
import type { AiDisclosureSummaryResponse, KeyFigure } from '../model/types'

interface SummaryContentProps {
  data: AiDisclosureSummaryResponse
}

const SENTIMENT_CONFIG = {
  positive: {
    label: '호재',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    dot: 'bg-green-500',
  },
  negative: {
    label: '악재',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    dot: 'bg-red-500',
  },
  neutral: {
    label: '중립',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-950/30',
    dot: 'bg-gray-500',
  },
} as const

export function SummaryContent({ data }: SummaryContentProps) {
  const sentiment = SENTIMENT_CONFIG[data.sentiment] ?? SENTIMENT_CONFIG.neutral

  return (
    <div className="flex flex-col gap-4">
      {/* 감성 분석 */}
      <Section title="감성 분석">
        <div className={cn('inline-flex items-center gap-2 rounded-lg px-3 py-2', sentiment.bg)}>
          <span className={cn('size-2 rounded-full', sentiment.dot)} />
          <span className={cn('text-sm font-medium', sentiment.color)}>{sentiment.label}</span>
        </div>
      </Section>

      {/* 핵심 요약 */}
      <Section title="핵심 요약">
        <p className="text-sm leading-relaxed text-foreground">{data.summary}</p>
      </Section>

      {/* 핵심 수치 */}
      {data.keyFigures.length > 0 && (
        <Section title="핵심 수치">
          <KeyFiguresTable keyFigures={data.keyFigures} />
        </Section>
      )}

      {/* 상세 분석 (Phase 3) */}
      {data.analysis && (
        <Section title="상세 분석">
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {data.analysis}
          </p>
        </Section>
      )}

      {/* 면책 조항 */}
      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          본 내용은 AI가 자동 생성한 것으로 투자 권유가 아닙니다. 투자 판단과 책임은 이용자 본인에게
          있습니다.{' '}
          <a href="/disclaimer" className="underline">
            면책 고지 전문
          </a>
          <br />
          생성: {formatCreatedAt(data.createdAt)}
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold text-muted-foreground">{title}</h4>
      {children}
    </div>
  )
}

function KeyFiguresTable({ keyFigures }: { keyFigures: KeyFigure[] }) {
  const hasAnyChange = keyFigures.some(f => f.change)

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full">
        <tbody>
          {keyFigures.map((figure, index) => (
            <tr key={figure.label} className={cn(index > 0 && 'border-t border-border')}>
              <td className="px-3 py-2 text-sm text-muted-foreground">{figure.label}</td>
              <td className="px-3 py-2 text-right text-sm font-medium">{figure.value}</td>
              {hasAnyChange && (
                <td className="px-3 py-2 text-right text-sm text-muted-foreground">
                  {figure.change ?? ''}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * ISO 날짜 문자열을 "YYYY-MM-DD HH:mm" 형식으로 변환합니다
 */
function formatCreatedAt(isoString: string): string {
  const d = new Date(isoString)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}
