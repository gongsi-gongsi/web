import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Toaster } from './sonner';

// Mock sonner's Toaster
vi.mock('sonner', async () => {
  const actual = await vi.importActual('sonner');
  return {
    ...actual,
    Toaster: ({ theme, className, style, icons, ...props }: Record<string, unknown>) => (
      <div
        data-testid="sonner-toaster"
        data-theme={theme}
        className={className as string}
        style={style as React.CSSProperties}
        {...props}
      >
        {icons ? <span data-testid="icons-present">아이콘 있음</span> : null}
      </div>
    ),
  };
});

describe('Toaster', () => {
  // -------------------------------------------------------------------------
  // 렌더링
  // -------------------------------------------------------------------------

  describe('렌더링', () => {
    it('Toaster를 올바르게 렌더링한다', () => {
      render(<Toaster />);
      expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument();
    });

    it('toaster group 클래스를 가진다', () => {
      render(<Toaster />);
      expect(screen.getByTestId('sonner-toaster')).toHaveClass('toaster', 'group');
    });

    it('커스텀 아이콘을 포함한다', () => {
      render(<Toaster />);
      expect(screen.getByTestId('icons-present')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 테마
  // -------------------------------------------------------------------------

  describe('테마', () => {
    it('ThemeProvider 없이 기본 테마(system)를 사용한다', () => {
      render(<Toaster />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-theme', 'system');
    });

    it('light 테마를 지원한다', () => {
      render(<Toaster theme="light" />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-theme', 'light');
    });

    it('dark 테마를 지원한다', () => {
      render(<Toaster theme="dark" />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-theme', 'dark');
    });

    it('system 테마를 지원한다', () => {
      render(<Toaster theme="system" />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-theme', 'system');
    });

    it('theme prop으로 테마를 설정할 수 있다', () => {
      render(<Toaster theme="dark" />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-theme', 'dark');
    });
  });

  // -------------------------------------------------------------------------
  // 스타일
  // -------------------------------------------------------------------------

  describe('스타일', () => {
    it('CSS 변수 스타일을 적용한다', () => {
      render(<Toaster />);
      const toaster = screen.getByTestId('sonner-toaster');
      expect(toaster).toHaveStyle({
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--border-radius': 'var(--radius)',
      });
    });
  });

  // -------------------------------------------------------------------------
  // Props 전달
  // -------------------------------------------------------------------------

  describe('props', () => {
    it('추가 props를 전달한다', () => {
      render(<Toaster data-custom="value" />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-custom', 'value');
    });

    it('position prop을 전달한다', () => {
      render(<Toaster position="top-center" />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('position', 'top-center');
    });

    it('duration prop을 전달한다', () => {
      render(<Toaster duration={5000} />);
      expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('duration', '5000');
    });
  });
});
