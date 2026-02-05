'use client'

import { Moon, Sun } from 'lucide-react'

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
  const { theme, setTheme } = useTheme()

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
      <span className="relative flex items-center justify-center">
        <Sun
          className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          size={iconSize}
        />
        <Moon
          className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          size={iconSize}
        />
      </span>
    </Button>
  )
}
