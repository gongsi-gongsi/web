'use client'

import { useEffect, useMemo, useRef } from 'react'
import { ResponsiveModal } from '@gs/ui'
import type { Disclosure } from '@/entities/disclosure'
import { trackAiDisclosureSummary } from '@/shared/lib/analytics'
import { useGenerateDisclosureSummary } from '../queries/hooks'
import type { AiDisclosureSummaryRequest } from '../model/types'
import { SummaryProgress } from './summary-progress'
import { SummaryContent } from './summary-content'

interface AiSummaryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disclosure: Disclosure
}

export function AiSummaryModal({ open, onOpenChange, disclosure }: AiSummaryModalProps) {
  const mutation = useGenerateDisclosureSummary()
  const hasMutatedRef = useRef(false)

  const requestBody = useMemo(
    (): AiDisclosureSummaryRequest => ({
      corpCode: disclosure.corpCode,
      corpName: disclosure.companyName,
      stockCode: disclosure.stockCode,
      market: disclosure.market === 'all' ? undefined : disclosure.market,
      reportName: disclosure.title,
      disclosureType: disclosure.type,
      receivedAt: disclosure.receivedAt,
      dartUrl: disclosure.reportUrl,
    }),
    [disclosure]
  )

  useEffect(() => {
    if (!open) {
      hasMutatedRef.current = false
      return
    }
    if (hasMutatedRef.current) return
    hasMutatedRef.current = true

    mutation.mutate({ rceptNo: disclosure.id, body: requestBody })
    trackAiDisclosureSummary(disclosure.companyName)
  }, [open, disclosure.id, requestBody, mutation])

  const description = `${disclosure.companyName} | ${disclosure.title}`

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="AI 공시 요약"
      description={description}
    >
      <div className="max-h-[60vh] overflow-y-auto scrollbar-hide px-1">
        {mutation.isPending && <SummaryProgress isLoading />}

        {mutation.isError &&
          (mutation.error.message === '로그인이 필요합니다' ? (
            <LoginPrompt />
          ) : (
            <ErrorState
              message={mutation.error.message}
              onRetry={() => {
                mutation.mutate({ rceptNo: disclosure.id, body: requestBody })
              }}
            />
          ))}

        {mutation.data && <SummaryContent data={mutation.data} />}
      </div>
    </ResponsiveModal>
  )
}

function LoginPrompt() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-sm text-muted-foreground">AI 요약을 사용하려면 로그인이 필요합니다</p>
      <a
        href={`/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        로그인하기
      </a>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        다시 시도
      </button>
    </div>
  )
}
