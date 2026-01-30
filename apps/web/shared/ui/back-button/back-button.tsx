'use client'

import { CaretLeftIcon } from '@phosphor-icons/react'

import { Button, cn } from '@ds/ui'

interface BackButtonProps {
  className?: string
  onClick?: () => void
}

/**
 * 뒤로가기 버튼
 * @param className - 추가 CSS 클래스
 * @param onClick - 클릭 핸들러 (기본: history.back)
 */
export function BackButton({ className, onClick }: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      interactive
      onClick={onClick ?? (() => window.history.back())}
      aria-label="뒤로가기"
      className={cn('-ml-2', className)}
    >
      <CaretLeftIcon className="size-5" weight="bold" />
    </Button>
  )
}
