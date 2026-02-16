# 작업 내역 요약

## 📋 작업 개요

기업 상세 페이지의 '뉴스' 탭을 Google News RSS 기반으로 구현했습니다. 기업명으로 Google News를 검색하여 관련 뉴스 30건을 표시하며, 최신순/관련도순 정렬 토글을 제공합니다.

## 📁 변경된 파일 목록

### 새로 추가된 파일

| 파일                                                               | 설명                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------- |
| `apps/web/entities/news/model/types.ts`                            | 뉴스 도메인 타입 정의 (NewsItem, NewsResponse)          |
| `apps/web/entities/news/lib/format-news.ts`                        | RSS XML → NewsItem 변환 및 상대 시간 포맷팅 유틸리티    |
| `apps/web/entities/news/api/google-news/server.ts`                 | 서버 전용 Google News RSS fetch + xml2js 파싱           |
| `apps/web/entities/news/api/google-news/client.ts`                 | 클라이언트 전용 `/api/news` API Route 호출              |
| `apps/web/entities/news/queries/hooks.ts`                          | `useCompanyNews` Suspense 기반 TanStack Query 훅        |
| `apps/web/entities/news/queries/index.ts`                          | queries barrel export                                   |
| `apps/web/entities/news/index.ts`                                  | 클라이언트용 barrel export                              |
| `apps/web/entities/news/server.ts`                                 | 서버용 barrel export                                    |
| `apps/web/app/api/news/route.ts`                                   | 뉴스 조회 API Route (`GET /api/news?q=기업명&limit=30`) |
| `apps/web/widgets/company-detail-page/ui/company-news-section.tsx` | 기업 상세 뉴스 탭 UI (목록, 정렬 토글, 스켈레톤)        |
| `spec/news/google-news-rss.md`                                     | Google News RSS 기반 뉴스 기능 명세서                   |

### 수정된 파일

| 파일                                                              | 변경 내용                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| `apps/web/shared/lib/query-keys.ts`                               | `news.company` 쿼리 키 추가                          |
| `apps/web/widgets/company-detail-page/ui/company-detail-page.tsx` | 뉴스 탭에서 `ComingSoon` → `CompanyNewsSection` 교체 |

## 🔧 상세 구현 내역

### 1. 뉴스 도메인 타입 정의

#### 📄 관련 파일

- `apps/web/entities/news/model/types.ts`

#### 💡 구현 내용

뉴스 도메인의 핵심 타입 2개를 정의했습니다.

- `NewsItem`: 개별 뉴스 항목 (제목, 링크, 게시일, 매체명, 매체URL)
- `NewsResponse`: 뉴스 API 응답 (items 배열, 검색 쿼리, 조회 시간)

#### 🎯 구현 이유

- FSD 패턴에서 entity의 model 레이어에 타입을 배치하여 도메인 모델 명확화
- 서버/클라이언트 양쪽에서 동일한 타입을 공유하기 위함

#### 📝 주요 변경 사항

- `NewsItem.pubDate`는 ISO 8601 문자열로 통일 (RSS의 RFC 2822 → ISO 변환)
- `source`와 `sourceUrl`을 분리하여 매체명 표시와 링크를 독립적으로 활용

---

### 2. RSS 파싱 및 포맷팅 유틸리티

#### 📄 관련 파일

- `apps/web/entities/news/lib/format-news.ts`

#### 💡 구현 내용

Google News RSS XML을 `NewsItem`으로 변환하는 유틸리티와 상대 시간 포맷팅 함수를 구현했습니다.

#### 🎯 구현 이유

- Google News RSS title에 `" - 매체명"` 접미사가 포함되어 있어 제거 로직 필요
- 뉴스 목록에서 "5분 전", "2시간 전" 등 상대 시간 표시를 위한 포맷팅 함수 필요

#### 📝 주요 변경 사항

- `stripSourceFromTitle()`: `lastIndexOf(' - ')`로 제목에서 매체명 접미사 제거
- `formatNewsItem()`: xml2js 파싱 결과의 배열 구조(`title[0]`, `link[0]` 등)를 평탄화
- `formatRelativeTime()`: 방금 전 → 분 → 시간 → 일 → 날짜 순으로 단계적 표시

#### 🔍 코드 예시

```typescript
// Google News RSS 제목: "삼성전자 주가 급등 - 한국경제"
// → stripSourceFromTitle() 결과: "삼성전자 주가 급등"

function stripSourceFromTitle(rawTitle: string): string {
  const lastDash = rawTitle.lastIndexOf(' - ')
  if (lastDash === -1) return rawTitle
  return rawTitle.slice(0, lastDash)
}
```

---

### 3. 서버/클라이언트 API 레이어

#### 📄 관련 파일

- `apps/web/entities/news/api/google-news/server.ts`
- `apps/web/entities/news/api/google-news/client.ts`
- `apps/web/app/api/news/route.ts`

#### 💡 구현 내용

서버에서 Google News RSS를 fetch하고, 클라이언트에서는 API Route를 통해 접근하는 구조입니다.

#### 🎯 구현 이유

- **서버 전용 fetch**: Google News RSS는 CORS 정책으로 클라이언트 직접 호출 불가
- **Next.js fetch 캐싱**: `revalidate: 300` (5분)으로 과도한 RSS 요청 방지 (IP 차단 방지)
- **서버/클라이언트 분리**: 기존 disclosure entity 패턴을 따름

#### 📝 주요 변경 사항

- `getGoogleNews()`: URL 객체의 `searchParams.append()`로 한글 쿼리 자동 인코딩
- `getNewsByCorpName()`: `getBaseUrl()` 유틸리티로 SSR/CSR 환경 모두 대응
- API Route: `q` (필수), `limit` (선택, 기본 10) 파라미터 처리

#### 🔍 코드 예시

```typescript
// 서버: Google News RSS fetch (5분 캐싱)
const response = await fetch(rssUrl.toString(), {
  next: {
    revalidate: 300,
    tags: ['news', query],
  },
})
```

---

### 4. TanStack Query 훅

#### 📄 관련 파일

- `apps/web/entities/news/queries/hooks.ts`
- `apps/web/shared/lib/query-keys.ts`

#### 💡 구현 내용

Suspense 기반의 `useCompanyNews` 훅과 중앙 쿼리 키 스토어에 `news.company` 키를 추가했습니다.

#### 🎯 구현 이유

- `useSuspenseQuery`를 사용하여 `Suspense` + `ErrorBoundary` 패턴과 통합
- `staleTime: 5분`으로 서버 캐싱(5분)과 동기화
- `@lukemorales/query-key-factory`의 기존 패턴을 따름

#### 📝 주요 변경 사항

- `useCompanyNews(corpName, limit)`: 기업명 기반 뉴스 조회 훅
- `queries.news.company(corpName)`: 타입 안전한 쿼리 키

---

### 5. 기업 상세 뉴스 탭 UI

#### 📄 관련 파일

- `apps/web/widgets/company-detail-page/ui/company-news-section.tsx`
- `apps/web/widgets/company-detail-page/ui/company-detail-page.tsx`

#### 💡 구현 내용

기업 상세 페이지 뉴스 탭의 전체 UI를 구현했습니다.

#### 🎯 구현 이유

- 기존 "뉴스 기능 준비중입니다" placeholder를 실제 뉴스 목록으로 교체
- 공시 카드 스타일(`interactive-card`, `rounded-xl`)을 뉴스에도 적용하여 UI 일관성 확보
- 최신순(기본) / 관련도순 토글로 사용자 선택권 제공

#### 📝 주요 변경 사항

- `SortToggle`: 최신순 ↔ 관련도순 토글 버튼 (CaretDownIcon 포함)
- `NewsListItem`: `interactive-card` 클래스 적용 (hover: bg-accent, active: scale 0.98)
- `NewsContent`: `useMemo`로 정렬 결과 메모이제이션 (최신순은 `pubDate` 내림차순 정렬)
- `NewsSkeleton`: 카드 스타일 매칭 스켈레톤
- `CompanyNewsSection`: `corpCode` → `corpName` 변환 후 뉴스 조회
- `company-detail-page.tsx`: `case 'news'`에서 `ErrorBoundary` + `Suspense`로 감싸서 연결

#### 🔍 코드 예시

```typescript
// 클라이언트 측 정렬 (관련도순은 RSS 원본 순서 유지)
const sortedItems = useMemo(() => {
  if (sortOrder === 'relevance') return data.items
  return [...data.items].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )
}, [data.items, sortOrder])
```

## 🎨 UI/UX 변경사항

- **뉴스 카드 디자인**: `rounded-xl bg-card interactive-card hover:bg-accent` — 공시 카드와 동일한 인터랙션 패턴
- **제목**: 한 줄 `truncate` 처리 (ellipsis)
- **메타 정보**: `{상대시간} · {매체명}` 형태
- **정렬 토글**: 상단에 "최신순 ∨" / "관련도순 ∨" 텍스트 버튼
- **빈 목록**: NewspaperIcon + "관련 뉴스가 없습니다" 메시지
- **로딩**: 5개 카드 형태 스켈레톤

## 📚 기타 참고사항

- **Google News RSS 특성**: 관련도순으로 반환 (시간순 아님), 최대 100건, 최근 30일 이내 뉴스만 제공
- **RSS 제목 가공**: Google News RSS 제목에 `" - 매체명"` 접미사가 포함되어 있어 `stripSourceFromTitle()`로 제거
- **명세서**: `spec/news/google-news-rss.md`에 향후 구현 예정인 홈 페이지 AI 선별 뉴스(Gemini API) 기능도 포함
- **Phase 3(홈 AI 뉴스)는 미구현**: 이번 작업은 Phase 1(데이터 레이어) + Phase 2(기업 상세 뉴스 탭)만 완료

## ✅ 테스트 결과

- 기업 상세 → 뉴스 탭 → 해당 기업 관련 뉴스 목록 표시 확인 필요
- 최신순 / 관련도순 토글 동작 확인 필요
- 뉴스 링크 클릭 → 새 탭에서 원문 열림 확인 필요
- `pnpm --filter web exec tsc --noEmit` 통과 확인 필요
