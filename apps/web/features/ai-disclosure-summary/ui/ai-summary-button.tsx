'use client'

import { useState } from 'react'
import { cn } from '@gs/ui'
import type { Disclosure } from '@/entities/disclosure'
import { AiSummaryModal } from './ai-summary-modal'

/** AI 요약 지원 공시 유형 (Phase 1: 정기공시만) */
const SUPPORTED_TYPES = new Set(['A'])

interface AiSummaryButtonProps {
  disclosure: Disclosure
  isSummarized: boolean
  variant?: 'card' | 'table'
}

export function AiSummaryButton({
  disclosure,
  isSummarized,
  variant = 'card',
}: AiSummaryButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 지원하지 않는 공시 유형이면 버튼 비표시
  if (!SUPPORTED_TYPES.has(disclosure.type)) return null

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'shrink-0 rounded-md text-xs font-medium transition-colors',
          variant === 'card' ? 'px-2 py-1' : 'px-2.5 py-1',
          isSummarized
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        {isSummarized ? 'AI 요약 \u2713' : 'AI 요약'}
      </button>

      {/* React portal 이벤트가 컴포넌트 트리를 따라 부모 Link/tr로 전파되는 것을 방지 */}
      {isModalOpen && (
        <div onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
          <AiSummaryModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            disclosure={disclosure}
          />
        </div>
      )}
    </>
  )
}
