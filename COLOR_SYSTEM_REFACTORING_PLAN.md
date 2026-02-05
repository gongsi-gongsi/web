# 공시공시 색상 시스템 리팩토링 계획서

**작성일**: 2026-02-05
**프로젝트**: 공시공시 (GongsiGongsi) - AI 주식 뉴스 분석 서비스
**목적**: 일관된 색상 시스템 구축 및 유지보수성 개선

---

## 📋 Executive Summary

### 현재 상태

- 총 33개의 색상 토큰 정의
- 44개 컴포넌트 파일 중 80%가 토큰 기반 색상 사용
- **3개 주요 파일에서 하드코딩된 색상 사용** (소셜 로그인, 공시 유형, 시장 구분)
- 1개 문법 오류 발견 (critical)

### 문제점

1. 🚨 **CRITICAL**: CSS 변수 문법 오류 (line 32)
2. 🔴 **HIGH**: 소셜 로그인 브랜드 색상 하드코딩 (카카오, 구글)
3. 🔴 **HIGH**: 공시 유형별 색상이 Tailwind 클래스로 하드코딩
4. 🔴 **HIGH**: 시장 구분 배지 색상이 Tailwind 클래스로 하드코딩
5. 🟡 **MEDIUM**: 성공/정보/알림 상태 색상 토큰 미정의
6. 🟡 **MEDIUM**: 투명도 수정자의 일관성 부족

### 목표

- ✅ 모든 하드코딩된 색상을 토큰 기반으로 전환
- ✅ 공시 유형, 시장 구분 등 도메인별 색상 체계 수립
- ✅ 일관된 색상 명명 규칙 적용
- ✅ 다크모드 대응 완성도 향상

---

## 🎨 현재 색상 시스템 분석

### 정의된 색상 토큰 (base.css)

#### 기본 색상 (Base Colors)

```css
--background       /* 배경색 */
--foreground       /* 전경색 (텍스트) */
--card             /* 카드 배경 */
--card-foreground  /* 카드 텍스트 */
--popover          /* 팝오버 배경 */
--popover-foreground /* 팝오버 텍스트 */
```

#### 시맨틱 색상 (Semantic Colors)

```css
--primary              /* 주요 액션 (파란색) */
--primary-foreground   /* primary 위의 텍스트 */
--primary-weak         /* primary 15% 투명도 - ⚠️ @theme에 미export */
--primary-weak-foreground /* primary-weak 위의 텍스트 - ⚠️ 미export */

--secondary            /* 보조 색상 */
--secondary-foreground

--accent               /* 강조 색상 - ⚠️ 문법 오류 존재 */
--accent-foreground    /* 🚨 SYNTAX ERROR: "foreground: oklch(...)" */

--destructive          /* 삭제/에러 (빨간색) */
--destructive-foreground
--destructive-weak     /* ⚠️ @theme에 미export */
--destructive-weak-foreground /* ⚠️ 미export */

--warning              /* 경고 (노란색) */
--warning-foreground
--warning-weak         /* ⚠️ @theme에 미export */
--warning-weak-foreground /* ⚠️ 미export */

--muted                /* 비활성/배경 */
--muted-foreground     /* 보조 텍스트 */

--border               /* 테두리 색상 */
--input                /* 입력 필드 배경 */
--ring                 /* 포커스 링 */
```

#### 차트 색상 (Chart Colors)

```css
--chart-1 ~ --chart-5  /* ⚠️ 사용처 없음 */
```

#### 사이드바 색상 (Sidebar Colors)

```css
--sidebar-*            /* ⚠️ 최소 사용 */
```

### 사용 빈도 분석

| 색상 토큰               | 사용 빈도 | 상태      |
| ----------------------- | --------- | --------- |
| `text-muted-foreground` | 34회      | ✅ 높음   |
| `bg-muted`              | 19회      | ✅ 높음   |
| `text-foreground`       | 13회      | ✅ 높음   |
| `bg-card`               | 10회      | ✅ 보통   |
| `bg-background`         | 9회       | ✅ 보통   |
| `bg-accent`             | 5회       | ✅ 보통   |
| `text-destructive`      | 5회       | ✅ 보통   |
| `border-border`         | 5회       | ✅ 보통   |
| `text-primary`          | 3회       | ⚠️ 낮음   |
| `chart-*`               | 0회       | ❌ 미사용 |
| `*-weak`                | 0회       | ❌ 미사용 |

---

## 🚨 발견된 문제점 상세

### 1. CRITICAL - CSS 문법 오류

**파일**: `/packages/tailwind-config/base.css`
**라인**: 32

```css
/* ❌ 현재 (잘못됨) */
--accent-foreground: foreground: oklch(0 0 0);

/* ✅ 수정 필요 */
--accent-foreground: oklch(0 0 0);
```

**영향도**: 브라우저에 따라 accent-foreground 색상이 제대로 렌더링되지 않을 수 있음

---

### 2. HIGH - 소셜 로그인 브랜드 색상 하드코딩

**파일**: `/apps/web/widgets/auth/ui/login-form.tsx`
**라인**: 67, 81

#### 현재 코드

```tsx
{/* 카카오 로그인 */}
<Button className="bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/85">
  카카오로 시작하기
</Button>

{/* 구글 로그인 */}
<Button className="bg-white text-[#191919]">
  <svg>
    {/* Google 로고 색상 */}
    <path fill="#4285F4" ... />
    <path fill="#34A853" ... />
    <path fill="#FBBC05" ... />
    <path fill="#EA4335" ... />
  </svg>
  Google로 시작하기
</Button>
```

#### 문제점

- 브랜드 색상이 하드코딩되어 있음
- 다크모드 대응 불가
- 디자인 시스템 외부에 존재
- 유지보수 어려움

#### 필요한 색상 토큰

```css
/* 카카오 */
--social-kakao-bg: #fee500 --social-kakao-fg: #191919 /* 구글 */ --social-google-bg: #ffffff
  --social-google-fg: #191919 --social-google-blue: #4285f4 --social-google-green: #34a853
  --social-google-yellow: #fbbc05 --social-google-red: #ea4335;
```

---

### 3. HIGH - 공시 유형별 색상 하드코딩

**파일**: `/apps/web/entities/disclosure/lib/get-disclosure-type-color.ts`

#### 현재 코드

```typescript
export function getDisclosureTypeColor(type: DisclosureType): string {
  const colors: Record<DisclosureType, string> = {
    A: 'bg-blue-500 dark:bg-blue-700', // 정기공시
    B: 'bg-red-500 dark:bg-red-700', // 주요사항보고
    C: 'bg-purple-500 dark:bg-purple-700', // 발행공시
    D: 'bg-orange-500 dark:bg-orange-700', // 지분공시
    E: 'bg-gray-500 dark:bg-gray-700', // 기타공시
    F: 'bg-green-500 dark:bg-green-700', // 외부감사
    G: 'bg-indigo-500 dark:bg-indigo-700', // 펀드공시
    H: 'bg-teal-500 dark:bg-teal-700', // 자산유동화
    I: 'bg-cyan-500 dark:bg-cyan-700', // 거래소공시
    J: 'bg-pink-500 dark:bg-pink-700', // 공정위공시
  }
  return colors[type] || colors.E
}
```

#### 문제점

- Tailwind 기본 색상 팔레트에 의존
- 시맨틱한 의미 부족 (`blue-500`이 정기공시를 의미한다는 걸 알 수 없음)
- Tailwind 버전 변경 시 색상이 달라질 수 있음
- 커스텀 색상 조정 불가

#### 필요한 색상 토큰

```css
/* Light Mode */
--disclosure-type-a-bg: oklch(0.6 0.2 250) /* 정기공시 - 파란색 */
  --disclosure-type-b-bg: oklch(0.6 0.25 25) /* 주요사항보고 - 빨간색 */
  --disclosure-type-c-bg: oklch(0.6 0.2 300) /* 발행공시 - 보라색 */
  --disclosure-type-d-bg: oklch(0.65 0.2 60) /* 지분공시 - 주황색 */
  --disclosure-type-e-bg: oklch(0.5 0.02 260) /* 기타공시 - 회색 */
  --disclosure-type-f-bg: oklch(0.6 0.2 150) /* 외부감사 - 초록색 */
  --disclosure-type-g-bg: oklch(0.55 0.2 270) /* 펀드공시 - 남색 */
  --disclosure-type-h-bg: oklch(0.6 0.15 180) /* 자산유동화 - 청록색 */
  --disclosure-type-i-bg: oklch(0.65 0.15 200) /* 거래소공시 - 하늘색 */
  --disclosure-type-j-bg: oklch(0.65 0.2 330) /* 공정위공시 - 분홍색 */
  /* Dark Mode - 각 색상의 밝기 조정 버전 */ --disclosure-type-a-bg: oklch(0.5 0.2 250)
  --disclosure-type-b-bg: oklch(0.5 0.25 25) /* ... 나머지 동일 패턴 */;
```

---

### 4. HIGH - 시장 구분 배지 색상 하드코딩

**파일**: `/apps/web/entities/disclosure/lib/get-market-badge.ts`

#### 현재 코드

```typescript
export function getMarketBadge(market: string): BadgeVariant {
  const badges: Record<string, BadgeVariant> = {
    kospi: {
      label: '유가증권',
      className: 'text-blue-700 border-blue-700 dark:text-blue-400 dark:border-blue-400',
    },
    kosdaq: {
      label: '코스닥',
      className: 'text-purple-700 border-purple-700 dark:text-purple-400 dark:border-purple-400',
    },
    konex: {
      label: '코넥스',
      className: 'text-orange-700 border-orange-700 dark:text-orange-400 dark:border-orange-400',
    },
    // ...
  }
}
```

#### 문제점

- 공시 유형과 동일한 문제
- Tailwind 색상 번호(700, 400)에 의존
- 시맨틱한 네이밍 부족

#### 필요한 색상 토큰

```css
/* Light Mode */
--market-kospi-text: oklch(0.35 0.15 250) /* 파란색 */ --market-kospi-border: oklch(0.35 0.15 250)
  --market-kosdaq-text: oklch(0.4 0.2 290) /* 보라색 */ --market-kosdaq-border: oklch(0.4 0.2 290)
  --market-konex-text: oklch(0.45 0.2 50) /* 주황색 */ --market-konex-border: oklch(0.45 0.2 50)
  /* Dark Mode */ --market-kospi-text: oklch(0.65 0.15 250)
  --market-kospi-border: oklch(0.65 0.15 250) --market-kosdaq-text: oklch(0.7 0.15 290)
  --market-kosdaq-border: oklch(0.7 0.15 290) --market-konex-text: oklch(0.7 0.15 50)
  --market-konex-border: oklch(0.7 0.15 50);
```

---

### 5. MEDIUM - 상태 색상 토큰 부족

#### 현재 상태

- ✅ `--destructive`: 에러/삭제 상태 존재
- ✅ `--warning`: 경고 상태 존재
- ❌ `--success`: 성공 상태 없음
- ❌ `--info`: 정보 상태 없음

#### 필요한 색상 토큰

```css
/* Success (성공) */
--success: oklch(0.6 0.2 150) /* 초록색 */ --success-foreground: oklch(1 0 0) /* 흰색 텍스트 */
  --success-weak: oklch(0.6 0.2 150 / 0.15) /* 15% 투명도 */
  --success-weak-foreground: oklch(0.6 0.2 150) /* Info (정보) */ --info: oklch(0.6 0.15 220)
  /* 하늘색 */ --info-foreground: oklch(1 0 0) --info-weak: oklch(0.6 0.15 220 / 0.15)
  --info-weak-foreground: oklch(0.6 0.15 220);
```

---

### 6. MEDIUM - 투명도 수정자의 일관성 부족

**파일**: `/apps/web/widgets/header/ui/desktop-header.tsx`

#### 현재 사용

```tsx
<div className="border-foreground/20" />       {/* 20% 투명도 */}
<span className="text-foreground/60" />        {/* 60% 투명도 */}
<span className="text-foreground/40" />        {/* 40% 투명도 */}
<span className="text-primary/60" />           {/* 60% 투명도 */}
```

#### 문제점

- 투명도 값이 일관성 없이 사용됨 (10, 20, 40, 60, 80, 85)
- 명시적인 토큰 없이 Tailwind 수정자에 의존

#### 제안 (선택사항)

명시적 투명도 토큰 정의 고려:

```css
/* Option 1: 명시적 투명도 토큰 */
--foreground-10: oklch(from var(--foreground) l c h / 0.1)
  --foreground-20: oklch(from var(--foreground) l c h / 0.2)
  --foreground-40: oklch(from var(--foreground) l c h / 0.4)
  --foreground-60: oklch(from var(--foreground) l c h / 0.6)
  /* Option 2: Tailwind 수정자 계속 사용 (현재 방식 유지) */
  /* 권장: Option 2 - Tailwind의 opacity 기능 활용 */;
```

---

### 7. LOW - 미사용 색상 토큰

#### 미사용 토큰

```css
--chart-1 ~ --chart-5      /* 사용처 0회 */
--gray-icon                /* 정의되었으나 @theme에 미export */
--primary-weak             /* 정의되었으나 @theme에 미export */
--destructive-weak         /* 정의되었으나 @theme에 미export */
--warning-weak             /* 정의되었으나 @theme에 미export */
--sidebar-* (대부분)       /* 최소 사용 */
```

#### 권장 조치

- 사용 계획이 없다면 제거
- 미래에 사용 예정이라면 @theme inline 블록에 export
- 문서화하여 사용 용도 명시

---

## 🎯 제안하는 색상 시스템 아키텍처

### 색상 계층 구조

```
1. Base Colors (기본 색상)
   └─ background, foreground, card, popover

2. Semantic Colors (시맨틱 색상)
   ├─ primary (주요 액션)
   ├─ secondary (보조 액션)
   ├─ accent (강조)
   └─ muted (비활성)

3. Status Colors (상태 색상)
   ├─ success (성공)
   ├─ info (정보)
   ├─ warning (경고)
   └─ destructive (에러/삭제)

4. Domain-Specific Colors (도메인별 색상)
   ├─ Social Brand Colors (소셜 브랜드)
   │  ├─ kakao
   │  └─ google
   ├─ Disclosure Type Colors (공시 유형)
   │  ├─ type-a (정기공시)
   │  ├─ type-b (주요사항보고)
   │  └─ ... (총 10종)
   └─ Market Colors (시장 구분)
      ├─ kospi
      ├─ kosdaq
      └─ konex

5. Interactive Colors (인터랙티브)
   └─ border, input, ring

6. Utility Colors (유틸리티)
   └─ chart-* (필요시)
```

### 색상 명명 규칙

```
패턴: --{category}-{variant}-{property}

예시:
--disclosure-type-a-bg          /* 공시 유형 A의 배경색 */
--disclosure-type-a-fg          /* 공시 유형 A의 전경색 */
--market-kospi-text             /* KOSPI 시장의 텍스트 색상 */
--social-kakao-bg               /* 카카오 배경색 */
--success-weak                  /* 성공 상태 약한 버전 */
```

---

## 📐 구현 계획

### Phase 1: Critical Fix (즉시 실행)

**목표**: 문법 오류 수정

#### Task 1.1 - CSS 문법 오류 수정

- **파일**: `/packages/tailwind-config/base.css`
- **변경사항**:
  ```diff
  - --accent-foreground: foreground: oklch(0 0 0);
  + --accent-foreground: oklch(0 0 0);
  ```
- **테스트**: accent 관련 UI 컴포넌트 렌더링 확인

---

### Phase 2: Social Brand Colors (High Priority)

**목표**: 소셜 로그인 브랜드 색상 토큰화

#### Task 2.1 - 색상 토큰 정의

- **파일**: `/packages/tailwind-config/base.css`
- **추가 위치**: `:root` 및 `.dark` 섹션
- **변경사항**:

```css
/* Light Mode (:root) */
:root {
  /* ... 기존 색상 ... */

  /* Social Brand Colors */
  --social-kakao-bg: oklch(0.95 0.15 100); /* #FEE500 */
  --social-kakao-fg: oklch(0.15 0 0); /* #191919 */
  --social-google-bg: oklch(1 0 0); /* #FFFFFF */
  --social-google-fg: oklch(0.15 0 0); /* #191919 */
  --social-google-blue: oklch(0.55 0.2 250); /* #4285F4 */
  --social-google-green: oklch(0.6 0.2 150); /* #34A853 */
  --social-google-yellow: oklch(0.8 0.2 90); /* #FBBC05 */
  --social-google-red: oklch(0.6 0.25 30); /* #EA4335 */
}

/* Dark Mode (.dark) */
.dark {
  /* ... 기존 색상 ... */

  /* Social Brand Colors - Dark Mode */
  --social-kakao-bg: oklch(0.85 0.15 100); /* 약간 어둡게 */
  --social-kakao-fg: oklch(0.15 0 0);
  --social-google-bg: oklch(0.9 0 0); /* 순백 대신 약간 어둡게 */
  --social-google-fg: oklch(0.15 0 0);
  /* Google 브랜드 색상은 동일 유지 */
  --social-google-blue: oklch(0.55 0.2 250);
  --social-google-green: oklch(0.6 0.2 150);
  --social-google-yellow: oklch(0.8 0.2 90);
  --social-google-red: oklch(0.6 0.25 30);
}
```

#### Task 2.2 - @theme inline 블록에 export

```css
@theme inline {
  /* ... 기존 export ... */

  /* Social Brand Colors */
  --color-social-kakao-bg: var(--social-kakao-bg);
  --color-social-kakao-fg: var(--social-kakao-fg);
  --color-social-google-bg: var(--social-google-bg);
  --color-social-google-fg: var(--social-google-fg);
  --color-social-google-blue: var(--social-google-blue);
  --color-social-google-green: var(--social-google-green);
  --color-social-google-yellow: var(--social-google-yellow);
  --color-social-google-red: var(--social-google-red);
}
```

#### Task 2.3 - login-form.tsx 리팩토링

- **파일**: `/apps/web/widgets/auth/ui/login-form.tsx`
- **변경사항**:

```diff
- <Button className="bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/85">
+ <Button className="bg-social-kakao-bg text-social-kakao-fg hover:bg-social-kakao-bg/85">
    카카오로 시작하기
  </Button>

- <Button className="bg-white text-[#191919]">
+ <Button className="bg-social-google-bg text-social-google-fg">
    <svg>
-     <path fill="#4285F4" ... />
+     <path className="fill-social-google-blue" ... />
-     <path fill="#34A853" ... />
+     <path className="fill-social-google-green" ... />
-     <path fill="#FBBC05" ... />
+     <path className="fill-social-google-yellow" ... />
-     <path fill="#EA4335" ... />
+     <path className="fill-social-google-red" ... />
    </svg>
    Google로 시작하기
  </Button>
```

#### Task 2.4 - 테스트

- [ ] 라이트모드에서 카카오 버튼 색상 확인
- [ ] 다크모드에서 카카오 버튼 색상 확인
- [ ] 구글 버튼 및 로고 색상 확인
- [ ] hover 상태 확인

---

### Phase 3: Disclosure Type Colors (High Priority)

**목표**: 공시 유형별 색상 시스템 구축

#### Task 3.1 - 색상 토큰 정의

- **파일**: `/packages/tailwind-config/base.css`

```css
/* Light Mode (:root) */
:root {
  /* ... 기존 색상 ... */

  /* Disclosure Type Colors */
  --disclosure-type-a-bg: oklch(0.6 0.2 250); /* 정기공시 - 파란색 */
  --disclosure-type-a-fg: oklch(1 0 0);
  --disclosure-type-b-bg: oklch(0.6 0.25 25); /* 주요사항보고 - 빨간색 */
  --disclosure-type-b-fg: oklch(1 0 0);
  --disclosure-type-c-bg: oklch(0.6 0.2 300); /* 발행공시 - 보라색 */
  --disclosure-type-c-fg: oklch(1 0 0);
  --disclosure-type-d-bg: oklch(0.65 0.2 60); /* 지분공시 - 주황색 */
  --disclosure-type-d-fg: oklch(0.1 0 0);
  --disclosure-type-e-bg: oklch(0.5 0.02 260); /* 기타공시 - 회색 */
  --disclosure-type-e-fg: oklch(1 0 0);
  --disclosure-type-f-bg: oklch(0.6 0.2 150); /* 외부감사 - 초록색 */
  --disclosure-type-f-fg: oklch(1 0 0);
  --disclosure-type-g-bg: oklch(0.55 0.2 270); /* 펀드공시 - 남색 */
  --disclosure-type-g-fg: oklch(1 0 0);
  --disclosure-type-h-bg: oklch(0.6 0.15 180); /* 자산유동화 - 청록색 */
  --disclosure-type-h-fg: oklch(1 0 0);
  --disclosure-type-i-bg: oklch(0.65 0.15 200); /* 거래소공시 - 하늘색 */
  --disclosure-type-i-fg: oklch(0.1 0 0);
  --disclosure-type-j-bg: oklch(0.65 0.2 330); /* 공정위공시 - 분홍색 */
  --disclosure-type-j-fg: oklch(0.1 0 0);
}

/* Dark Mode (.dark) */
.dark {
  /* ... 기존 색상 ... */

  /* Disclosure Type Colors - Dark Mode (더 어둡게) */
  --disclosure-type-a-bg: oklch(0.5 0.2 250);
  --disclosure-type-a-fg: oklch(1 0 0);
  --disclosure-type-b-bg: oklch(0.5 0.25 25);
  --disclosure-type-b-fg: oklch(1 0 0);
  --disclosure-type-c-bg: oklch(0.5 0.2 300);
  --disclosure-type-c-fg: oklch(1 0 0);
  --disclosure-type-d-bg: oklch(0.55 0.2 60);
  --disclosure-type-d-fg: oklch(1 0 0);
  --disclosure-type-e-bg: oklch(0.4 0.02 260);
  --disclosure-type-e-fg: oklch(0.95 0 0);
  --disclosure-type-f-bg: oklch(0.5 0.2 150);
  --disclosure-type-f-fg: oklch(1 0 0);
  --disclosure-type-g-bg: oklch(0.45 0.2 270);
  --disclosure-type-g-fg: oklch(1 0 0);
  --disclosure-type-h-bg: oklch(0.5 0.15 180);
  --disclosure-type-h-fg: oklch(1 0 0);
  --disclosure-type-i-bg: oklch(0.55 0.15 200);
  --disclosure-type-i-fg: oklch(1 0 0);
  --disclosure-type-j-bg: oklch(0.55 0.2 330);
  --disclosure-type-j-fg: oklch(1 0 0);
}
```

#### Task 3.2 - @theme inline 블록에 export

```css
@theme inline {
  /* ... 기존 export ... */

  /* Disclosure Type Colors */
  --color-disclosure-type-a-bg: var(--disclosure-type-a-bg);
  --color-disclosure-type-a-fg: var(--disclosure-type-a-fg);
  --color-disclosure-type-b-bg: var(--disclosure-type-b-bg);
  --color-disclosure-type-b-fg: var(--disclosure-type-b-fg);
  --color-disclosure-type-c-bg: var(--disclosure-type-c-bg);
  --color-disclosure-type-c-fg: var(--disclosure-type-c-fg);
  --color-disclosure-type-d-bg: var(--disclosure-type-d-bg);
  --color-disclosure-type-d-fg: var(--disclosure-type-d-fg);
  --color-disclosure-type-e-bg: var(--disclosure-type-e-bg);
  --color-disclosure-type-e-fg: var(--disclosure-type-e-fg);
  --color-disclosure-type-f-bg: var(--disclosure-type-f-bg);
  --color-disclosure-type-f-fg: var(--disclosure-type-f-fg);
  --color-disclosure-type-g-bg: var(--disclosure-type-g-bg);
  --color-disclosure-type-g-fg: var(--disclosure-type-g-fg);
  --color-disclosure-type-h-bg: var(--disclosure-type-h-bg);
  --color-disclosure-type-h-fg: var(--disclosure-type-h-fg);
  --color-disclosure-type-i-bg: var(--disclosure-type-i-bg);
  --color-disclosure-type-i-fg: var(--disclosure-type-i-fg);
  --color-disclosure-type-j-bg: var(--disclosure-type-j-bg);
  --color-disclosure-type-j-fg: var(--disclosure-type-j-fg);
}
```

#### Task 3.3 - get-disclosure-type-color.ts 리팩토링

- **파일**: `/apps/web/entities/disclosure/lib/get-disclosure-type-color.ts`
- **변경사항**:

```typescript
// ❌ 기존 코드
export function getDisclosureTypeColor(type: DisclosureType): string {
  const colors: Record<DisclosureType, string> = {
    A: 'bg-blue-500 dark:bg-blue-700',
    B: 'bg-red-500 dark:bg-red-700',
    // ...
  }
  return colors[type] || colors.E
}

// ✅ 새로운 코드
export interface DisclosureTypeColorScheme {
  bg: string
  text: string
}

export function getDisclosureTypeColor(type: DisclosureType): DisclosureTypeColorScheme {
  const colors: Record<DisclosureType, DisclosureTypeColorScheme> = {
    A: { bg: 'bg-disclosure-type-a-bg', text: 'text-disclosure-type-a-fg' },
    B: { bg: 'bg-disclosure-type-b-bg', text: 'text-disclosure-type-b-fg' },
    C: { bg: 'bg-disclosure-type-c-bg', text: 'text-disclosure-type-c-fg' },
    D: { bg: 'bg-disclosure-type-d-bg', text: 'text-disclosure-type-d-fg' },
    E: { bg: 'bg-disclosure-type-e-bg', text: 'text-disclosure-type-e-fg' },
    F: { bg: 'bg-disclosure-type-f-bg', text: 'text-disclosure-type-f-fg' },
    G: { bg: 'bg-disclosure-type-g-bg', text: 'text-disclosure-type-g-fg' },
    H: { bg: 'bg-disclosure-type-h-bg', text: 'text-disclosure-type-h-fg' },
    I: { bg: 'bg-disclosure-type-i-bg', text: 'text-disclosure-type-i-fg' },
    J: { bg: 'bg-disclosure-type-j-bg', text: 'text-disclosure-type-j-fg' },
  }
  return colors[type] || colors.E
}
```

#### Task 3.4 - 사용처 업데이트

- **파일**: 공시 유형 색상을 사용하는 모든 컴포넌트
- **변경사항**: 기존 string 반환을 ColorScheme 객체로 변경

```diff
- <Badge className={getDisclosureTypeColor(disclosure.type)}>
+ <Badge className={`${colorScheme.bg} ${colorScheme.text}`}>
    {getDisclosureTypeLabel(disclosure.type)}
  </Badge>
```

#### Task 3.5 - 테스트

- [ ] 모든 공시 유형(A~J) 색상 확인
- [ ] 라이트모드 색상 확인
- [ ] 다크모드 색상 확인
- [ ] 텍스트 가독성 확인

---

### Phase 4: Market Badge Colors (High Priority)

**목표**: 시장 구분 배지 색상 토큰화

#### Task 4.1 - 색상 토큰 정의

- **파일**: `/packages/tailwind-config/base.css`

```css
/* Light Mode (:root) */
:root {
  /* ... 기존 색상 ... */

  /* Market Colors */
  --market-kospi-text: oklch(0.35 0.15 250); /* KOSPI - 파란색 */
  --market-kospi-border: oklch(0.35 0.15 250);
  --market-kosdaq-text: oklch(0.4 0.2 290); /* KOSDAQ - 보라색 */
  --market-kosdaq-border: oklch(0.4 0.2 290);
  --market-konex-text: oklch(0.45 0.2 50); /* KONEX - 주황색 */
  --market-konex-border: oklch(0.45 0.2 50);
  --market-etc-text: oklch(0.4 0.02 260); /* ETC - 회색 */
  --market-etc-border: oklch(0.4 0.02 260);
}

/* Dark Mode (.dark) */
.dark {
  /* ... 기존 색상 ... */

  /* Market Colors - Dark Mode (더 밝게) */
  --market-kospi-text: oklch(0.65 0.15 250);
  --market-kospi-border: oklch(0.65 0.15 250);
  --market-kosdaq-text: oklch(0.7 0.15 290);
  --market-kosdaq-border: oklch(0.7 0.15 290);
  --market-konex-text: oklch(0.7 0.15 50);
  --market-konex-border: oklch(0.7 0.15 50);
  --market-etc-text: oklch(0.6 0.02 260);
  --market-etc-border: oklch(0.6 0.02 260);
}
```

#### Task 4.2 - @theme inline 블록에 export

```css
@theme inline {
  /* ... 기존 export ... */

  /* Market Colors */
  --color-market-kospi-text: var(--market-kospi-text);
  --color-market-kospi-border: var(--market-kospi-border);
  --color-market-kosdaq-text: var(--market-kosdaq-text);
  --color-market-kosdaq-border: var(--market-kosdaq-border);
  --color-market-konex-text: var(--market-konex-text);
  --color-market-konex-border: var(--market-konex-border);
  --color-market-etc-text: var(--market-etc-text);
  --color-market-etc-border: var(--market-etc-border);
}
```

#### Task 4.3 - get-market-badge.ts 리팩토링

- **파일**: `/apps/web/entities/disclosure/lib/get-market-badge.ts`

```typescript
// ✅ 새로운 코드
export interface MarketBadgeVariant {
  label: string
  textColor: string
  borderColor: string
}

export function getMarketBadge(market: string): MarketBadgeVariant {
  const badges: Record<string, MarketBadgeVariant> = {
    kospi: {
      label: '유가증권',
      textColor: 'text-market-kospi-text',
      borderColor: 'border-market-kospi-border',
    },
    kosdaq: {
      label: '코스닥',
      textColor: 'text-market-kosdaq-text',
      borderColor: 'border-market-kosdaq-border',
    },
    konex: {
      label: '코넥스',
      textColor: 'text-market-konex-text',
      borderColor: 'border-market-konex-border',
    },
    all: {
      label: '-',
      textColor: 'text-market-etc-text',
      borderColor: 'border-market-etc-border',
    },
  }
  return badges[market] || badges.all
}
```

#### Task 4.4 - 테스트

- [ ] KOSPI 배지 색상 확인
- [ ] KOSDAQ 배지 색상 확인
- [ ] KONEX 배지 색상 확인
- [ ] 다크모드 확인

---

### Phase 5: Status Colors (Medium Priority)

**목표**: 성공/정보 상태 색상 추가

#### Task 5.1 - 색상 토큰 정의

- **파일**: `/packages/tailwind-config/base.css`

```css
/* Light Mode (:root) */
:root {
  /* ... 기존 색상 ... */

  /* Success */
  --success: oklch(0.6 0.2 150);
  --success-foreground: oklch(1 0 0);
  --success-weak: oklch(0.6 0.2 150 / 0.15);
  --success-weak-foreground: oklch(0.6 0.2 150);

  /* Info */
  --info: oklch(0.6 0.15 220);
  --info-foreground: oklch(1 0 0);
  --info-weak: oklch(0.6 0.15 220 / 0.15);
  --info-weak-foreground: oklch(0.6 0.15 220);
}

/* Dark Mode (.dark) */
.dark {
  /* ... 기존 색상 ... */

  /* Success - Dark Mode */
  --success: oklch(0.6 0.2 150);
  --success-foreground: oklch(1 0 0);
  --success-weak: oklch(0.6 0.2 150 / 0.15);
  --success-weak-foreground: oklch(0.6 0.2 150);

  /* Info - Dark Mode */
  --info: oklch(0.6 0.15 220);
  --info-foreground: oklch(1 0 0);
  --info-weak: oklch(0.6 0.15 220 / 0.15);
  --info-weak-foreground: oklch(0.6 0.15 220);
}
```

#### Task 5.2 - @theme inline 블록에 export

```css
@theme inline {
  /* ... 기존 export ... */

  /* Status Colors */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-success-weak: var(--success-weak);
  --color-success-weak-foreground: var(--success-weak-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-info-weak: var(--info-weak);
  --color-info-weak-foreground: var(--info-weak-foreground);
}
```

#### Task 5.3 - Button variant 추가 (선택사항)

- **파일**: `/packages/ui/src/components/button/button.tsx` (있다면)

```typescript
const buttonVariants = cva(
  // ... base ...
  {
    variants: {
      variant: {
        // ... 기존 variants ...
        success: 'bg-success text-success-foreground hover:bg-success/90',
        info: 'bg-info text-info-foreground hover:bg-info/90',
      },
    },
  }
)
```

---

### Phase 6: Cleanup & Optimization (Low Priority)

**목표**: 미사용 토큰 정리

#### Task 6.1 - 미사용 토큰 결정

- [ ] `--chart-*` 토큰 사용 계획 확인
- [ ] `--*-weak` 토큰 export 여부 결정
- [ ] `--gray-icon` export 여부 결정

#### Task 6.2 - 제거 또는 Export

**Option A: 제거**

```css
/* 사용하지 않는 토큰 삭제 */
```

**Option B: Export**

```css
@theme inline {
  --color-chart-1: var(--chart-1);
  --color-primary-weak: var(--primary-weak);
  /* ... */
}
```

---

## 🧪 테스트 체크리스트

### Phase별 테스트

#### Phase 1: Critical Fix

- [ ] accent 관련 UI 정상 렌더링
- [ ] 에러 로그 없음

#### Phase 2: Social Colors

- [ ] 카카오 버튼 라이트모드 색상
- [ ] 카카오 버튼 다크모드 색상
- [ ] 카카오 버튼 hover 상태
- [ ] 구글 버튼 라이트모드 색상
- [ ] 구글 버튼 다크모드 색상
- [ ] 구글 로고 4가지 색상 모두 표시

#### Phase 3: Disclosure Colors

- [ ] 10가지 공시 유형 모두 표시
- [ ] 라이트모드에서 텍스트 가독성
- [ ] 다크모드에서 텍스트 가독성
- [ ] 배지 크기 및 레이아웃 정상

#### Phase 4: Market Colors

- [ ] KOSPI 배지 라이트모드
- [ ] KOSPI 배지 다크모드
- [ ] KOSDAQ 배지 라이트모드
- [ ] KOSDAQ 배지 다크모드
- [ ] KONEX 배지 라이트모드
- [ ] KONEX 배지 다크모드

#### Phase 5: Status Colors

- [ ] success 버튼/알림
- [ ] info 버튼/알림
- [ ] 다크모드 대응

### 전체 시스템 테스트

- [ ] 모든 페이지 렌더링 확인
- [ ] 라이트/다크 모드 전환 테스트
- [ ] 브라우저 호환성 (Chrome, Safari, Firefox)
- [ ] 색상 대비 (WCAG AA 기준)
- [ ] 색각 이상 시뮬레이션 (선택사항)

---

## 📝 구현 가이드라인

### 1. 색상 추가 시 체크리스트

- [ ] `:root`에 라이트모드 색상 정의
- [ ] `.dark`에 다크모드 색상 정의
- [ ] `@theme inline` 블록에 export
- [ ] JSDoc 주석으로 용도 설명
- [ ] 실제 사용처 구현 및 테스트

### 2. 색상 값 선택 기준

- **oklch 색공간 사용**: 더 일관된 밝기와 채도
- **명도(Lightness)**:
  - Light mode: 0.6~0.7 (중간)
  - Dark mode: 0.4~0.5 (어둡게)
- **채도(Chroma)**: 0.15~0.25 (적당히 선명)
- **색상(Hue)**: 의미에 맞게 선택
  - 파란색: 240~260
  - 초록색: 140~160
  - 빨간색: 20~40
  - 노란색: 90~110

### 3. 네이밍 원칙

```
형식: --{domain}-{element}-{property}

Good:
--disclosure-type-a-bg
--market-kospi-text
--social-kakao-bg

Bad:
--blue500
--disclosureA
--kakaoYellow
```

### 4. 다크모드 원칙

- 배경색은 어둡게 (lightness 감소)
- 텍스트 색은 밝게 (lightness 증가)
- 채도는 유지하되 약간 낮출 수 있음
- 대비는 WCAG AA 기준 유지 (4.5:1)

---

## 📊 예상 영향도

### 수정 파일 목록

| 파일                                                             | 변경 유형 | 영향도             |
| ---------------------------------------------------------------- | --------- | ------------------ |
| `/packages/tailwind-config/base.css`                             | Major     | 모든 컴포넌트      |
| `/apps/web/widgets/auth/ui/login-form.tsx`                       | Medium    | 로그인 페이지만    |
| `/apps/web/entities/disclosure/lib/get-disclosure-type-color.ts` | Medium    | 공시 관련 컴포넌트 |
| `/apps/web/entities/disclosure/lib/get-market-badge.ts`          | Small     | 시장 배지만        |
| 공시 유형/시장 배지 사용 컴포넌트들                              | Small     | 각 컴포넌트        |

### 작업 시간 예상

- **Phase 1**: 10분 (문법 수정 + 테스트)
- **Phase 2**: 1시간 (토큰 정의 + 리팩토링 + 테스트)
- **Phase 3**: 2시간 (10개 유형 토큰 + 리팩토링 + 테스트)
- **Phase 4**: 1시간 (토큰 정의 + 리팩토링 + 테스트)
- **Phase 5**: 1시간 (상태 색상 + 테스트)
- **Phase 6**: 30분 (정리)
- **총 예상 시간**: 5.5~6시간

---

## 🔄 롤백 계획

만약 색상 변경 후 문제가 발생하면:

### 1. Git Revert

```bash
git revert <commit-hash>
```

### 2. 단계별 롤백

각 Phase는 독립적이므로 개별 롤백 가능

### 3. 임시 Override

긴급 수정이 필요한 경우:

```css
/* 임시 오버라이드 */
.emergency-fix {
  background-color: #ORIGINAL_COLOR !important;
}
```

---

## 📚 참고 자료

- [OKLCH Color Space](https://oklch.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- 프로젝트 내 파일:
  - `/packages/tailwind-config/base.css`
  - `/CLAUDE.md` (프로젝트 규칙)

---

## ✅ 실행 순서 요약

1. ✅ **Phase 1 실행** → 문법 오류 수정 (Critical)
2. ✅ **Phase 2 실행** → 소셜 색상 토큰화 (High)
3. ✅ **Phase 3 실행** → 공시 유형 색상 토큰화 (High)
4. ✅ **Phase 4 실행** → 시장 배지 색상 토큰화 (High)
5. ⏸️ **Phase 5 실행** → 상태 색상 추가 (Medium) - 필요시
6. ⏸️ **Phase 6 실행** → 정리 (Low) - 필요시

---

**다음 단계**: Phase 1부터 순차적으로 실행
**문의사항**: 각 Phase 시작 전 확인 및 승인 필요
