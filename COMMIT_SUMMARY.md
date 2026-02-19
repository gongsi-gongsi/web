# 작업 내역 요약

## 📋 작업 개요

기업 상세 페이지 요약 탭에 Gemini Flash 기반 AI 기업 분석 카드를 추가한다.
재무 데이터(분기별 매출/영업이익/순이익)와 최근 뉴스 제목을 조합하여 3~4문장의 통합 요약을 생성하고, `unstable_cache`로 corpCode별 24시간 서버 캐싱하여 모든 사용자가 동일한 결과를 본다.

## 📁 변경된 파일 목록

### 새로 추가된 파일

| 파일                                                           | 설명                                                     |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| `apps/web/shared/lib/gemini/client.ts`                         | Gemini API(gemini-2.5-flash-lite) 호출 클라이언트        |
| `apps/web/shared/lib/gemini/index.ts`                          | Gemini 모듈 barrel export                                |
| `apps/web/features/ai-company-summary/model/types.ts`          | `AiCompanySummary` 인터페이스 정의                       |
| `apps/web/features/ai-company-summary/lib/build-prompt.ts`     | 재무+뉴스 데이터로 Gemini 프롬프트 생성                  |
| `apps/web/features/ai-company-summary/api/generate-summary.ts` | 서버 전용 요약 생성 오케스트레이터 (unstable_cache 적용) |
| `apps/web/features/ai-company-summary/api/client.ts`           | 클라이언트용 API Route fetch 함수                        |
| `apps/web/features/ai-company-summary/queries/hooks.ts`        | `useAiCompanySummary` React Query 훅                     |
| `apps/web/features/ai-company-summary/ui/ai-summary-card.tsx`  | AI 요약 카드 UI (시머 로딩 + 본문 + 면책 문구)           |
| `apps/web/features/ai-company-summary/index.ts`                | feature barrel export                                    |
| `apps/web/app/api/companies/[corpCode]/ai-summary/route.ts`    | AI 요약 API Route Handler                                |

### 수정된 파일

| 파일                                                             | 변경 내용                                    |
| ---------------------------------------------------------------- | -------------------------------------------- |
| `apps/web/shared/lib/query-keys.ts`                              | `ai.companySummary` 쿼리 키 추가             |
| `apps/web/widgets/financial-statements/ui/financial-section.tsx` | SummarySection에 AiSummaryCard 삽입          |
| `packages/tailwind-config/animations.css`                        | `.ai-shimmer-line` 시머 로딩 CSS 클래스 추가 |

## 🔧 상세 구현 내역

### 1. Gemini API 클라이언트

#### 📄 관련 파일

- `apps/web/shared/lib/gemini/client.ts`
- `apps/web/shared/lib/gemini/index.ts`

#### 💡 구현 내용

Google Gemini REST API를 직접 호출하는 범용 클라이언트. `generateContent(prompt)` 함수 하나로 텍스트 생성을 수행한다.

#### 🎯 구현 이유

- **모델 선택**: `gemini-2.5-flash-lite`를 사용. 무료 티어 기준 ~1,000 RPD로 rate limit이 넉넉하고, thinking 모드가 아니라 응답 파싱이 단순함
- **temperature 0.3**: 사실 기반 분석이므로 창의성보다 일관성을 우선
- **SDK 미사용**: `@google/generative-ai` SDK 대신 직접 fetch. 의존성 최소화 및 Next.js fetch 캐싱과의 호환성 확보

#### 📝 주요 변경 사항

- `GEMINI_API_KEY` 환경변수 필수 검증
- 응답에서 `candidates[0].content.parts[0].text` 추출
- 에러 시 상세 에러 바디 포함한 메시지 throw

### 2. 타입 정의

#### 📄 관련 파일

- `apps/web/features/ai-company-summary/model/types.ts`

#### 💡 구현 내용

```typescript
export interface AiCompanySummary {
  summary: string // 통합 요약 (재무 + 이슈 + 전망)
  generatedAt: string // 생성 시각 (ISO 8601)
}
```

#### 🎯 구현 이유

초기에는 `financial`, `issues`, `outlook` 3개 필드로 설계했으나, 읽을 내용이 많아 가독성이 떨어져 하나의 `summary` 필드로 통합. 3~4문장의 자연스러운 문단 형태가 사용자 경험에 더 적합하다.

### 3. 프롬프트 빌더

#### 📄 관련 파일

- `apps/web/features/ai-company-summary/lib/build-prompt.ts`

#### 💡 구현 내용

재무 데이터와 뉴스 제목을 구조화된 프롬프트로 변환한다.

#### 🎯 구현 이유

- **재무 포맷팅**: 원 단위를 억 원으로 변환하고, 전기 대비 성장률을 계산하여 Gemini가 숫자를 올바르게 해석하도록 함
- **JSON 출력 강제**: 프롬프트에서 "반드시 JSON 형식으로만 응답" 지시하여 파싱 안정성 확보
- **잠정실적 표시**: `isProvisional` 플래그가 있는 분기는 `(잠정)` 표시로 정확도 전달

#### 🔍 코드 예시

```typescript
function formatToEok(value: number | null): string {
  if (value === null) return '데이터 없음'
  const eok = Math.round(value / 100_000_000)
  return `${eok.toLocaleString('ko-KR')}억`
}
```

### 4. 서버 요약 생성 + 캐싱

#### 📄 관련 파일

- `apps/web/features/ai-company-summary/api/generate-summary.ts`
- `apps/web/app/api/companies/[corpCode]/ai-summary/route.ts`

#### 💡 구현 내용

기업 정보 → 재무/뉴스 병렬 조회 → 프롬프트 빌드 → Gemini 호출 → JSON 파싱의 파이프라인을 실행한다. `unstable_cache`로 감싸서 corpCode별 24시간 서버 캐싱을 적용.

#### 🎯 구현 이유

- **`unstable_cache` 사용**: CDN 유무와 관계없이 Next.js 서버 레벨에서 캐싱. 모든 사용자가 동일한 요약을 보고, Gemini 호출은 기업당 하루 1회로 제한
- **병렬 조회**: `Promise.all`로 재무 데이터와 뉴스를 동시 fetch하여 응답 시간 단축
- **JSON 파싱 방어**: Gemini가 마크다운 코드블록(` ```json `)으로 감싸거나 순수 JSON으로 응답하는 두 경우 모두 처리
- **에러 격리**: 재무/뉴스 조회 실패 시 `.catch(() => null)`로 부분 데이터로도 요약 생성 가능

#### 🔍 코드 예시

```typescript
// unstable_cache로 감싸서 corpCode별 서버 캐싱
export const generateCompanySummary = unstable_cache(
  _generateCompanySummary,
  ['ai-company-summary'],
  { revalidate: 86400 } // 24시간
)
```

#### 📝 주요 변경 사항

- Route Handler는 유효성 검사(8자리 숫자) + `generateCompanySummary` 호출만 담당
- `Cache-Control` 헤더 제거 — 서버 캐시(`unstable_cache`)가 이미 처리하므로 CDN 캐시 헤더 불필요

### 5. 클라이언트 데이터 레이어

#### 📄 관련 파일

- `apps/web/features/ai-company-summary/api/client.ts`
- `apps/web/features/ai-company-summary/queries/hooks.ts`
- `apps/web/shared/lib/query-keys.ts`

#### 💡 구현 내용

클라이언트에서 API Route를 호출하는 fetch 함수와 React Query 훅.

#### 🎯 구현 이유

- **`useQuery` 사용 (not `useSuspenseQuery`)**: SSR 시 Gemini가 매번 다른 텍스트를 생성하여 hydration mismatch가 발생. 클라이언트 마운트 후에만 fetch하도록 `useQuery`를 사용하여 문제 해결
- **`staleTime: 24시간`**: 서버 캐시와 동일한 주기. 같은 세션 내에서 탭 이동 시 재요청 방지
- **`retry: false`**: Gemini 실패 시 재시도하지 않음. rate limit 소모 방지

### 6. UI 카드 컴포넌트

#### 📄 관련 파일

- `apps/web/features/ai-company-summary/ui/ai-summary-card.tsx`

#### 💡 구현 내용

모바일/PC 반응형 AI 요약 카드. 로딩 중에는 타이틀("AI 기업 분석" + Beta 배지)을 유지하고 본문만 시머 애니메이션 표시, 에러 시 카드 자체를 숨긴다.

#### 🎯 구현 이유

- **타이틀 항상 노출**: 로딩 중에도 "AI 기업 분석" 타이틀을 보여줘서 사용자가 무엇이 로딩되는지 인지할 수 있도록 함
- **에러 시 `return null`**: AI 기능 실패가 기존 콘텐츠(재무제표, 차트)에 영향을 주지 않도록 graceful degradation
- **수동 날짜 포맷**: `toLocaleDateString()` 대신 직접 `YYYY.MM.DD HH:mm` 포맷 — 서버/클라이언트 로케일 차이로 인한 hydration mismatch 방지
- **모바일/PC 분리 렌더링**: 모바일은 패딩만, PC는 `Card` 컴포넌트 사용

### 7. 시머 로딩 애니메이션

#### 📄 관련 파일

- `packages/tailwind-config/animations.css`

#### 💡 구현 내용

`.ai-shimmer-line` CSS 클래스로 좌→우 그라데이션 시머 효과 구현. 다크 모드 대응 포함.

#### 🎯 구현 이유

- **하드코딩 컬러 사용**: Tailwind v4에서 CSS 변수(`hsl(var(--muted))`)가 gradient arbitrary value에서 동작하지 않는 제한이 있어, `#e5e7eb` / `#1f2937` 등 hex 값을 직접 사용
- **기존 `skeleton` 키프레임 재활용**: 동일한 `background-position` 애니메이션이므로 별도 키프레임 생성 대신 기존 것을 공유하여 중복 방지

#### 🔍 코드 예시

```css
.ai-shimmer-line {
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
  background-size: 200% 100%;
  animation: skeleton 1.8s ease-in-out infinite;
}

.dark .ai-shimmer-line {
  background: linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%);
}
```

### 8. SummarySection 통합

#### 📄 관련 파일

- `apps/web/widgets/financial-statements/ui/financial-section.tsx`

#### 💡 구현 내용

기존 `SummarySection`의 CompanyOverview와 SegmentControl 사이에 `AiSummaryCard`를 삽입.

#### 🎯 구현 이유

- **Suspense/ErrorBoundary 미사용**: `useQuery`가 클라이언트 전용이고, 컴포넌트 내부에서 `isError` 시 `null` 반환하므로 별도 에러 바운더리 불필요
- **모바일 구분선 추가**: AI 카드와 차트 영역 사이에 시각적 구분을 위한 `h-6` 구분선

## 📚 기타 참고사항

### 캐싱 구조 (2단계)

| 레이어                  | 위치            | TTL    | 역할                                           |
| ----------------------- | --------------- | ------ | ---------------------------------------------- |
| `unstable_cache`        | Next.js 서버    | 24시간 | corpCode별 Gemini 결과 캐싱 (모든 사용자 공유) |
| React Query `staleTime` | 브라우저 메모리 | 24시간 | 같은 세션 내 재요청 방지                       |

### Gemini 모델 선택 이력

| 모델                    | 문제                                         | 결과     |
| ----------------------- | -------------------------------------------- | -------- |
| `gemini-2.0-flash`      | 무료 티어 rate limit 초과 (429)              | 변경     |
| `gemini-2.5-flash`      | thinking 모델이라 파싱 복잡 + 일일 20회 제한 | 변경     |
| `gemini-2.5-flash-lite` | ~1,000 RPD, 비-thinking, 파싱 단순           | **채택** |

### 환경변수

- `GEMINI_API_KEY`: Google AI Studio에서 발급한 API 키 (`.env.local`에 설정)

## ✅ 테스트 결과

- `pnpm --filter web build` 성공
- API 엔드포인트 `/api/companies/{corpCode}/ai-summary` HTTP 200 응답 확인 (~4.3초)
- 시머 로딩 애니메이션 + 요약 본문 표시 정상 동작
- Gemini 실패 시 카드 숨김 (기존 콘텐츠 영향 없음)
