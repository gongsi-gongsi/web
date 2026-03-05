'use client'

import { LinkIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@gs/ui'

interface ShareButtonProps {
  url?: string
  className?: string
}

export function ShareButton({ url, className }: ShareButtonProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = url ?? window.location.href

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('링크가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleShare}
      className={className}
      aria-label="링크 복사"
    >
      <LinkIcon className="size-4" />
    </Button>
  )
}
