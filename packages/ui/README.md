# @repo/ui

공통 UI 컴포넌트 라이브러리

## 기능

- 🎨 **21개 UI 컴포넌트** - 완전한 UI 컴포넌트 라이브러리
- 🌓 **다크 모드 지원** - 라이트/다크 테마 자동 전환
- 🎭 **Storybook** - 컴포넌트 개발 및 문서화
- 🧪 **Vitest** - 단위 테스트
- 🎨 **Tailwind CSS v4** - 최신 CSS 변수 기반 테마 시스템

## 컴포넌트 목록

### 기본 컴포넌트
- **Alert** - 알림 메시지
- **Avatar** - 사용자 아바타
- **Badge** - 배지/태그
- **Button** - 버튼
- **Card** - 카드 레이아웃
- **Input** - 입력 필드
- **Label** - 라벨

### 폼 컴포넌트
- **Checkbox** - 체크박스
- **Switch** - 토글 스위치

### 레이아웃 컴포넌트
- **Separator** - 구분선
- **Sidebar** - 사이드바 네비게이션
- **Sheet** - 슬라이드 패널
- **Tabs** - 탭 네비게이션

### 오버레이 컴포넌트
- **Dialog** - 다이얼로그/모달
- **Dropdown Menu** - 드롭다운 메뉴
- **Tooltip** - 툴팁

### 데이터 표시
- **Table** - 테이블
- **Pagination** - 페이지네이션
- **Skeleton** - 스켈레톤 로더

### 피드백
- **Sonner** - 토스트 알림
- **Theme Toggle** - 테마 전환 버튼

## 사용법

### 컴포넌트 import

\`\`\`tsx
import { Button, Card, CardHeader, CardTitle } from '@repo/ui';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <Button>Click me</Button>
    </Card>
  );
}
\`\`\`

### 다크 모드 설정

\`\`\`tsx
import { ThemeProvider } from '@repo/ui';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {/* Your app */}
    </ThemeProvider>
  );
}
\`\`\`

### cn 유틸리티 함수

Tailwind 클래스를 조건부로 적용할 때 사용:

\`\`\`tsx
import { cn } from '@repo/ui';

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
\`\`\`

## 개발

### Storybook 실행

\`\`\`bash
cd packages/ui
pnpm storybook
\`\`\`

브라우저에서 http://localhost:6006 열기

**Storybook 기능:**
- 🌓 **라이트/다크 모드 토글** - 상단 툴바에서 테마 전환
- 📱 **반응형 뷰포트** - 다양한 화면 크기 테스트
- 🎛️ **Controls** - 실시간 props 조작
- 📖 **자동 문서화** - 각 컴포넌트의 props와 사용 예시

### 테스트 실행

\`\`\`bash
pnpm test           # 단위 테스트 실행
pnpm test:ui        # UI 모드로 테스트 실행
\`\`\`

### 린트

\`\`\`bash
pnpm lint
\`\`\`

## 프로젝트 구조

\`\`\`
packages/ui/
├── src/
│   ├── components/       # UI 컴포넌트 (폴더별 구조)
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.test.tsx
│   │   │   ├── button.stories.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # 유틸리티 함수
│   ├── providers/       # Context Providers
│   ├── test-utils/      # 테스트 유틸리티
│   ├── base.css         # 테마 CSS 변수
│   ├── animations.css   # 애니메이션 정의
│   ├── styles.css       # 메인 스타일
│   └── index.ts         # 메인 export
├── .storybook/          # Storybook 설정
└── package.json
\`\`\`

## 테마 커스터마이징

테마 색상은 `src/base.css`에서 CSS 변수로 정의됩니다:

\`\`\`css
:root {
  --background: oklch(0.9654 0.0042 236.5);
  --foreground: oklch(0 0 0);
  --primary: oklch(0.6671 0.1615 245.54);
  /* ... */
}

.dark {
  --background: oklch(0.1708 0.0103 285.25);
  --foreground: oklch(1 0 0);
  /* ... */
}
\`\`\`

## 라이선스

MIT
