import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '../../providers/theme-provider'

import { ThemeToggle } from './theme-toggle'

// ============================================================================
// Test Wrapper
// ============================================================================

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="light" storageKey="test-theme">
    {children}
  </ThemeProvider>
)

describe('ThemeToggle', () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  describe('렌더링', () => {
    it('테마 토글 버튼을 렌더링한다', () => {
      render(<ThemeToggle />, { wrapper: Wrapper })
      const button = screen.getByRole('button', { name: /테마 전환/i })
      expect(button).toBeInTheDocument()
    })

    it('테마에 따라 아이콘을 렌더링한다', () => {
      const { container } = render(<ThemeToggle />, { wrapper: Wrapper })
      const icons = container.querySelectorAll('svg')
      // 현재 테마에 맞는 아이콘 1개만 렌더링
      expect(icons).toHaveLength(1)
    })
  })

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  describe('props', () => {
    it('커스텀 className을 적용한다', () => {
      render(<ThemeToggle className="custom-class" />, { wrapper: Wrapper })
      const button = screen.getByRole('button', { name: /테마 전환/i })
      expect(button.className).toContain('custom-class')
    })

    it('iconSize prop을 적용한다', () => {
      const { container } = render(<ThemeToggle iconSize={24} />, { wrapper: Wrapper })
      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('width', '24')
      expect(icon).toHaveAttribute('height', '24')
    })

    it('추가 HTML 속성을 전달한다', () => {
      render(<ThemeToggle data-testid="theme-toggle" />, { wrapper: Wrapper })
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Interactions
  // -------------------------------------------------------------------------

  describe('인터랙션', () => {
    it('클릭 시 테마를 변경한다', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /테마 전환/i })
      await user.click(button)

      // localStorage에 테마가 저장되었는지 확인
      expect(localStorage.getItem('test-theme')).toBeTruthy()
    })

    it('light에서 dark로 전환한다', async () => {
      const user = userEvent.setup()
      localStorage.setItem('test-theme', 'light')

      render(<ThemeToggle />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /테마 전환/i })
      await user.click(button)

      expect(localStorage.getItem('test-theme')).toBe('dark')
    })

    it('dark에서 light로 전환한다', async () => {
      const user = userEvent.setup()
      localStorage.setItem('test-theme', 'dark')

      render(<ThemeToggle />, { wrapper: Wrapper })

      const button = screen.getByRole('button', { name: /테마 전환/i })
      await user.click(button)

      expect(localStorage.getItem('test-theme')).toBe('light')
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------

  describe('접근성', () => {
    it('적절한 aria-label을 가진다', () => {
      render(<ThemeToggle />, { wrapper: Wrapper })
      expect(screen.getByRole('button', { name: /테마 전환/i })).toBeInTheDocument()
    })

    it('button role을 가진다', () => {
      render(<ThemeToggle />, { wrapper: Wrapper })
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
