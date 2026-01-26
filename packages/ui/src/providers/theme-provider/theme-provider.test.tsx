import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider, useTheme } from './theme-provider';

import type { ReactNode } from 'react';

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// matchMedia mock
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // 렌더링
  // -------------------------------------------------------------------------

  describe('렌더링', () => {
    it('children을 올바르게 렌더링한다', () => {
      render(
        <ThemeProvider>
          <div>테스트 내용</div>
        </ThemeProvider>
      );
      expect(screen.getByText('테스트 내용')).toBeInTheDocument();
    });

    it('기본 테마는 system이다', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('system');
    });

    it('defaultTheme prop으로 초기 테마를 설정할 수 있다', () => {
      const customWrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });
      expect(result.current.theme).toBe('dark');
    });
  });

  // -------------------------------------------------------------------------
  // 테마 변경
  // -------------------------------------------------------------------------

  describe('테마 변경', () => {
    it('setTheme으로 테마를 변경할 수 있다', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('테마 변경 시 localStorage에 저장한다', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('split-theme', 'dark');
    });

    it('커스텀 storageKey를 사용할 수 있다', () => {
      const customWrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider storageKey="custom-theme">{children}</ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });

      act(() => {
        result.current.setTheme('light');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('custom-theme', 'light');
    });
  });

  // -------------------------------------------------------------------------
  // 클래스 적용
  // -------------------------------------------------------------------------

  describe('클래스 적용', () => {
    it('테마에 따라 html 요소에 클래스를 추가한다', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('테마 변경 시 이전 클래스를 제거한다', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // data-theme 속성
  // -------------------------------------------------------------------------

  describe('data-theme 속성', () => {
    it('attribute="data-theme"일 때 data-theme 속성을 사용한다', () => {
      const customWrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  // -------------------------------------------------------------------------
  // 에러 처리
  // -------------------------------------------------------------------------

  describe('에러 처리', () => {
    it('ThemeProvider 없이 useTheme 사용 시 에러를 던진다', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  // 인터랙션
  // -------------------------------------------------------------------------

  describe('인터랙션', () => {
    it('버튼 클릭으로 테마를 변경할 수 있다', async () => {
      const user = userEvent.setup();

      const ThemeToggle = () => {
        const { theme, setTheme } = useTheme();
        return (
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            현재 테마: {theme}
          </button>
        );
      };

      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      expect(screen.getByText('현재 테마: light')).toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('현재 테마: dark')).toBeInTheDocument();
    });
  });
});
