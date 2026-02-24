'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Heart } from '@phosphor-icons/react'
import { toast } from 'sonner'

import { cn } from '@gs/ui'

import { useCurrentUser } from '@/entities/user/model/use-current-user'
import { useWatchlistCheck, useAddToWatchlist, useRemoveFromWatchlist } from '@/entities/watchlist'
import { trackAddWatchlist, trackRemoveWatchlist } from '@/shared/lib/analytics'

interface ToggleWatchlistButtonProps {
  corpCode: string
  className?: string
}

export function ToggleWatchlistButton({ corpCode, className }: ToggleWatchlistButtonProps) {
  const router = useRouter()
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { data: watchlistCheck, isLoading: isCheckLoading } = useWatchlistCheck(corpCode)
  const { mutate: addToWatchlist, isPending: isAdding } = useAddToWatchlist()
  const { mutate: removeFromWatchlist, isPending: isRemoving } = useRemoveFromWatchlist()
  const [isAnimating, setIsAnimating] = useState(false)

  const isWatchlisted = watchlistCheck?.isWatchlisted ?? false
  const isPending = isAdding || isRemoving

  function handleClick() {
    if (isUserLoading || isPending) return

    if (!user) {
      router.push('/login')
      return
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 450)

    if (isWatchlisted) {
      removeFromWatchlist(corpCode, {
        onSuccess: () => {
          toast.success('관심 종목에서 제거되었습니다')
          trackRemoveWatchlist(corpCode)
        },
        onError: () => toast.error('잠시 후 다시 시도해주세요'),
      })
    } else {
      addToWatchlist(corpCode, {
        onSuccess: () => {
          toast.success('관심 종목에 추가되었습니다')
          trackAddWatchlist(corpCode)
        },
        onError: () => toast.error('잠시 후 다시 시도해주세요'),
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || isCheckLoading}
      className={cn(
        'group relative flex size-10 items-center justify-center rounded-full transition-all duration-300',
        'disabled:pointer-events-none disabled:opacity-50',
        isWatchlisted ? 'bg-rose-50 dark:bg-rose-950/30' : 'hover:bg-muted',
        className
      )}
      aria-label={isWatchlisted ? '관심 종목 해제' : '관심 종목 추가'}
    >
      <Heart
        weight={isWatchlisted ? 'fill' : 'regular'}
        className={cn(
          'size-[22px] transition-all duration-300',
          isWatchlisted ? 'text-rose-500' : 'text-muted-foreground group-hover:text-rose-400',
          isAnimating && 'animate-heart-beat'
        )}
      />
    </button>
  )
}
