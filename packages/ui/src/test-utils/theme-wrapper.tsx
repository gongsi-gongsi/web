import { ThemeProvider } from '../providers/theme-provider';

import type { Theme } from '../providers/theme-provider';
import type { ReactNode } from 'react';

interface ThemeWrapperProps {
  children: ReactNode;
  theme?: Theme;
}

/**
 * 테스트용 ThemeProvider 래퍼
 * 다크모드/라이트모드 테스트에 사용
 *
 * @example
 * ```tsx
 * render(<Button>테스트</Button>, {
 *   wrapper: ({ children }) => <ThemeWrapper theme="dark">{children}</ThemeWrapper>
 * });
 * ```
 */
export function ThemeWrapper({ children, theme = 'light' }: ThemeWrapperProps) {
  return <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>;
}

/**
 * 다크모드 래퍼
 */
export function DarkThemeWrapper({ children }: { children: ReactNode }) {
  return <ThemeWrapper theme="dark">{children}</ThemeWrapper>;
}

/**
 * 라이트모드 래퍼
 */
export function LightThemeWrapper({ children }: { children: ReactNode }) {
  return <ThemeWrapper theme="light">{children}</ThemeWrapper>;
}

/**
 * 다크모드 클래스를 document에 직접 적용하는 유틸리티
 * CSS 클래스 기반 테스트에 사용
 */
export function setDarkMode(enabled: boolean) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}

/**
 * 테스트 후 테마 클래스 정리
 */
export function cleanupTheme() {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.removeAttribute('data-theme');
}
