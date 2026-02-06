'use client'

import { MoonIcon, SunIcon } from '@phosphor-icons/react'

import { useTheme } from '../../providers/theme-provider'
import { Button } from '../button'

import type { ButtonHTMLAttributes } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 아이콘 크기 */
  iconSize?: number
}

// ============================================================================
// Component
// ============================================================================

export function ThemeToggle({ iconSize = 20, className, ...props }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else {
      // system 모드일 경우 light로 전환
      setTheme('light')
    }
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 전환"
      className={className}
      {...props}
      interactive
      onClick={toggleTheme}
    >
      {isDark ? (
        <MoonIcon size={iconSize} weight="fill" />
      ) : (
        <SunIcon size={iconSize} weight="fill" />
      )}
    </Button>
  )
}
