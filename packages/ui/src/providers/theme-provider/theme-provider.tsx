'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeProviderProps {
  /** 자식 요소 */
  children: ReactNode;
  /** 기본 테마 */
  defaultTheme?: Theme;
  /** 로컬 스토리지 키 */
  storageKey?: string;
  /** 테마를 적용할 속성 (class 또는 data-theme) */
  attribute?: 'class' | 'data-theme';
  /** 색상 스키마 비활성화 */
  disableTransitionOnChange?: boolean;
}

export interface ThemeContextValue {
  /** 현재 테마 설정 (light, dark, system) */
  theme: Theme;
  /** 실제 적용된 테마 (light, dark) */
  resolvedTheme: 'light' | 'dark';
  /** 테마 변경 함수 */
  setTheme: (theme: Theme) => void;
}

// ============================================================================
// Context
// ============================================================================

export const ThemeProviderContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ============================================================================
// Utils
// ============================================================================

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// ============================================================================
// Component
// ============================================================================

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'split-theme',
  attribute = 'class',
  disableTransitionOnChange = false,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'system') return getSystemTheme();
    return theme;
  });

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 테마 적용
  useEffect(() => {
    const root = window.document.documentElement;
    const newResolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    // 트랜지션 비활성화
    if (disableTransitionOnChange) {
      root.style.setProperty('transition', 'none');
    }

    // 이전 테마 제거 및 새 테마 적용
    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
    } else {
      root.setAttribute('data-theme', newResolvedTheme);
    }

    setResolvedTheme(newResolvedTheme);

    // 트랜지션 복원
    if (disableTransitionOnChange) {
      // reflow 강제
      void root.offsetHeight;
      root.style.removeProperty('transition');
    }
  }, [theme, attribute, disableTransitionOnChange]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
    [storageKey]
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};
