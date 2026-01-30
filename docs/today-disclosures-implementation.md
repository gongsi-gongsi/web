# 오늘의 공시 기능 구현 문서

## 📋 목차

1. [기능 개요](#기능-개요)
2. [아키텍처 및 파일 구조](#아키텍처-및-파일-구조)
3. [파일별 상세 설명](#파일별-상세-설명)
4. [캐싱 전략](#캐싱-전략)
5. [API 구조](#api-구조)
6. [사용 방법](#사용-방법)
7. [트러블슈팅](#트러블슈팅)

---

## 기능 개요

오늘의 공시 기능은 DART(전자공시시스템)의 실시간 공시 정보를 제공하는 기능입니다.

### 주요 특징

- ✅ **실시간 갱신**: 30초마다 자동으로 최신 공시 정보 업데이트
- ✅ **시장별 필터링**: 전체/코스피/코스닥/코스넥 시장별 분류
- ✅ **반응형 UI**: 모바일(카드), PC(테이블) 최적화
- ✅ **2단계 캐싱**: 서버 + 클라이언트 캐싱으로 성능 최적화
- ✅ **타입 안정성**: TypeScript로 완전한 타입 정의

### 구현 결과

- **표시 개수**: 최대 7개 공시
- **갱신 주기**: 30초
- **정렬**: 접수번호 최신순 (rcept_no desc)
- **캐싱 효과**: API 호출 98% 감소

---

## 아키텍처 및 파일 구조

### FSD (Feature-Sliced Design) 아키텍처

```
apps/web/
├── app/
│   ├── api/
│   │   └── disclosures/
│   │       └── today/
│   │           └── route.ts              # DART API 프록시 (서버 캐싱)
│   ├── page.tsx                          # 메인 페이지 (위젯 사용)
│   └── providers.tsx                     # React Query Provider
│
├── entities/
│   └── disclosure/
│       ├── index.ts                      # Public exports
│       ├── api/
│       │   └── get-today-disclosures.ts  # API 호출 함수
│       ├── model/
│       │   ├── types.ts                  # 타입 정의
│       │   └── use-today-disclosures.ts  # React Query hook
│       └── lib/
│           ├── format-disclosure.ts      # DART API 응답 변환
│           └── get-disclosure-type-color.ts  # 공시 유형별 색상
│
├── widgets/
│   └── today-disclosures/
│       ├── index.ts
│       ├── today-disclosures.tsx         # 메인 위젯 (탭 + 반응형)
│       └── ui/
│           ├── market-tabs.tsx           # 시장 탭
│           ├── disclosure-table.tsx      # 테이블 (PC)
│           ├── disclosure-table-row.tsx  # 테이블 행
│           ├── disclosure-table-skeleton.tsx  # 테이블 스켈레톤
│           ├── disclosure-card.tsx       # 카드 (모바일)
│           ├── disclosure-card-list.tsx  # 카드 리스트
│           └── disclosure-skeleton.tsx   # 카드 스켈레톤
│
└── shared/
    └── lib/
        └── format-relative-time.ts       # 상대 시간 포맷팅
```

---

## 파일별 상세 설명

### 1. API Layer

#### `app/api/disclosures/today/route.ts`

**역할**: DART Open API 프록시 서버, 서버 사이드 캐싱

```typescript
// 주요 기능
- DART API 호출 (list.json)
- 30초 서버 캐싱 (Next.js Data Cache)
- 에러 핸들링
- 시장별 필터링 (corp_cls 파라미터)
```

**핵심 코드**:

```typescript
// 1. 시장 코드 변환
function getCorpClsFromMarket(market: Market): string {
  switch (market) {
    case 'all':
      return 'Y' // 전체
    case 'kospi':
      return 'K' // 코스피
    case 'kosdaq':
      return 'N' // 코스닥
    case 'konex':
      return 'E' // 코스넥
  }
}

// 2. 오늘 날짜 생성 (YYYYMMDD)
function getTodayDateString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// 3. DART API 호출 (30초 캐싱)
const response = await fetch(dartUrl.toString(), {
  next: {
    revalidate: 30, // 30초 캐시
    tags: ['disclosures', 'today', market],
  },
})
```

**환경 변수**:

- `DART_API_KEY`: DART Open API 인증키 (`.env.local`)

---

### 2. Entity Layer

#### `entities/disclosure/model/types.ts`

**역할**: 공시 관련 타입 정의

```typescript
// 시장 구분
export type Market = 'all' | 'kospi' | 'kosdaq' | 'konex'

// 공시 유형
export type DisclosureType = 'regular' | 'major' | 'fair' | 'other'

// 공시 데이터 (클라이언트)
export interface Disclosure {
  id: string // 접수번호 (rcept_no)
  title: string // 공시 제목
  companyName: string // 회사명
  stockCode: string // 종목 코드
  corpCode: string // 회사 고유번호
  market: Market // 시장 구분
  type: DisclosureType // 공시 유형
  receivedAt: string // 접수 시간 (ISO string)
  submitter: string // 제출인
  reportUrl: string // DART 보고서 URL
}

// DART API 원본 응답
export interface DartDisclosureItem {
  corp_code: string // 회사 고유번호
  corp_name: string // 회사명
  stock_code: string // 종목코드
  corp_cls: string // 법인구분 (Y/K/N/E)
  report_nm: string // 보고서명
  rcept_no: string // 접수번호 (14자리)
  flr_nm: string // 공시제출인명
  rcept_dt: string // 접수일자 (YYYYMMDD)
  rm: string // 비고
}
```

**주의사항**:

- `receivedAt`은 JSON 직렬화 후 `string` 타입
- DART API는 시간 정보 제공 안 함 (날짜만)

---

#### `entities/disclosure/lib/format-disclosure.ts`

**역할**: DART API 응답을 앱 내부 형식으로 변환

```typescript
// 핵심 함수
export function formatDisclosure(item: DartDisclosureItem): Disclosure

// 주요 변환 로직:
// 1. 시장 구분 (corp_cls → Market)
//    Y → all, K → kospi, N → kosdaq, E → konex

// 2. 공시 유형 판별 (report_nm → DisclosureType)
//    - 분기보고서, 반기보고서, 사업보고서 → 'regular'
//    - 주요사항보고, 합병, 자사주 등 → 'major'
//    - 공정공시 → 'fair'
//    - 기타 → 'other'

// 3. 날짜 파싱 (rcept_dt: YYYYMMDD → ISO string)
function parseDateString(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4), 10)
  const month = parseInt(dateStr.substring(4, 6), 10) - 1
  const day = parseInt(dateStr.substring(6, 8), 10)
  return new Date(year, month, day)
}

// 4. DART 보고서 URL 생성
const reportUrl = `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rcept_no}`
```

---

#### `entities/disclosure/lib/get-disclosure-type-color.ts`

**역할**: 공시 유형별 색상 및 레이블 제공

```typescript
// 반환 타입
interface DisclosureTypeColor {
  bg: string // 배경 색상 클래스
  text: string // 텍스트 색상 클래스
  label: string // 표시 레이블
}

// 색상 매핑
export function getDisclosureTypeColor(type: DisclosureType) {
  switch (type) {
    case 'regular': // 정기공시
      return {
        bg: 'bg-orange-100 dark:bg-orange-950',
        text: 'text-orange-700 dark:text-orange-400',
        label: '정기공시',
      }
    case 'major': // 주요사항
      return {
        bg: 'bg-blue-100 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-400',
        label: '주요사항',
      }
    case 'fair': // 공정공시
      return {
        bg: 'bg-green-100 dark:bg-green-950',
        text: 'text-green-700 dark:text-green-400',
        label: '공정공시',
      }
    case 'other': // 기타
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-400',
        label: '기타',
      }
  }
}
```

---

#### `entities/disclosure/model/use-today-disclosures.ts`

**역할**: React Query hook (클라이언트 캐싱 + 자동 갱신)

```typescript
export function useTodayDisclosures(market: Market = 'all') {
  return useQuery({
    queryKey: ['disclosures', 'today', market],
    queryFn: () => getTodayDisclosures(market),

    // 클라이언트 캐싱 설정
    refetchInterval: 30000, // 30초마다 자동 refetch
    refetchIntervalInBackground: false, // 백그라운드 탭에서는 중지
    staleTime: 30000, // 30초간 fresh 상태 유지
  })
}
```

**캐싱 동작**:

1. 첫 호출: API 요청 → 캐시 저장
2. 30초 이내: 캐시에서 즉시 반환 (네트워크 요청 없음)
3. 30초 후: 백그라운드 refetch → 캐시 갱신
4. 탭 전환 시: 이전 시장의 캐시 유지 (빠른 전환)

---

#### `entities/disclosure/api/get-today-disclosures.ts`

**역할**: API 호출 함수

```typescript
export async function getTodayDisclosures(
  market: Market = 'all'
): Promise<TodayDisclosuresResponse> {
  const params = new URLSearchParams({ market })
  const response = await fetch(`/api/disclosures/today?${params}`)

  if (!response.ok) {
    throw new Error('Failed to fetch today disclosures')
  }

  return response.json()
}
```

---

### 3. Widget Layer

#### `widgets/today-disclosures/today-disclosures.tsx`

**역할**: 메인 위젯 (탭 + 반응형 목록)

```typescript
// 주요 기능
- URL 쿼리 파라미터로 시장 상태 관리 (?market=kospi)
- 탭 전환 시 URL 업데이트
- 수동 새로고침 버튼
- 반응형 분기 (768px)
  - 모바일: 카드 리스트
  - PC: 테이블

// 상태 관리
const [selectedMarket, setSelectedMarket] = useState<Market>(initialMarket)
const { data, isLoading, error, refetch } = useTodayDisclosures(selectedMarket)

// 탭 전환
function handleMarketChange(market: Market) {
  setSelectedMarket(market)
  const params = new URLSearchParams(searchParams.toString())
  params.set('market', market)
  router.push(`?${params.toString()}`, { scroll: false })
}

// 7개만 표시
const disclosures = data?.disclosures.slice(0, 7) || []
```

**Suspense 필요**:

- `useSearchParams()` 사용으로 인해 페이지에서 `<Suspense>` 필요

---

#### `widgets/today-disclosures/ui/market-tabs.tsx`

**역할**: 시장 탭 네비게이션

```typescript
const MARKETS = [
  { value: 'all', label: '전체' },
  { value: 'kospi', label: '코스피' },
  { value: 'kosdaq', label: '코스닥' },
  { value: 'konex', label: '코스넥' },
]

// 선택된 탭 스타일
selectedMarket === market.value
  ? 'bg-foreground text-background' // 선택됨
  : 'bg-secondary text-secondary-foreground' // 미선택
```

---

#### `widgets/today-disclosures/ui/disclosure-table.tsx`

**역할**: 공시 테이블 (PC용)

```typescript
// 테이블 레이아웃
<table className="w-full table-fixed">
  <thead>
    <tr>
      <th className="w-[10%]">접수일자</th>  // 날짜 (YYYY.MM.DD)
      <th className="w-[20%]">회사명</th>
      <th className="w-[10%]">시장</th>
      <th className="w-[45%]">공시제목</th>  // 가장 넓게
      <th className="w-[15%]">공시유형</th>
    </tr>
  </thead>
</table>
```

**핵심 스타일**:

- `table-fixed`: 컬럼 비율 고정 (탭 전환 시에도 일관성)
- `w-[n%]`: 각 컬럼 비율 명시

---

#### `widgets/today-disclosures/ui/disclosure-table-row.tsx`

**역할**: 테이블 행

```typescript
// 날짜 포맷팅
const receivedDate = new Date(disclosure.receivedAt)
const year = receivedDate.getFullYear()
const month = String(receivedDate.getMonth() + 1).padStart(2, '0')
const day = String(receivedDate.getDate()).padStart(2, '0')
const dateString = `${year}.${month}.${day}`  // 2026.01.29

// Ellipsis 처리
<td className="px-4 py-3">
  <div className="truncate">  // 텍스트 넘치면 ... 표시
    {content}
  </div>
</td>

// 링크
<Link
  href={disclosure.reportUrl}
  target="_blank"
  rel="noopener noreferrer"
  title={disclosure.title}  // 호버 시 전체 제목
>
```

---

#### `widgets/today-disclosures/ui/disclosure-card.tsx`

**역할**: 공시 카드 (모바일용)

```typescript
// 카드 레이아웃
<Link href={reportUrl} className="block rounded-lg border">
  {/* 상단: 태그 + 시간 */}
  <div className="flex justify-between">
    <span className={cn(typeColor.bg, typeColor.text)}>
      {typeColor.label}
    </span>
    <span>{relativeTime}</span>  // "5분 전"
  </div>

  {/* 중앙: 제목 */}
  <h3 className="line-clamp-2">{title}</h3>

  {/* 하단: 회사명 */}
  <p>{companyName} ({stockCode})</p>
</Link>
```

**스타일 특징**:

- `line-clamp-2`: 제목 최대 2줄
- `hover:bg-accent`: 호버 효과

---

### 4. Shared Layer

#### `shared/lib/format-relative-time.ts`

**역할**: 상대 시간 포맷팅

```typescript
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) return '방금 전'

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일 전`

  // 일주일 이상이면 날짜 표시
  const month = targetDate.getMonth() + 1
  const day = targetDate.getDate()
  return `${month}월 ${day}일`
}
```

**주의사항**:

- `Date | string` 모두 받음 (JSON 직렬화 대응)

---

## 캐싱 전략

### 2단계 캐싱 아키텍처

```
사용자 요청
    ↓
┌─────────────────────────────────────────┐
│ 1️⃣ 클라이언트 캐시 (React Query)      │
│   - 메모리 캐시                        │
│   - staleTime: 30초                    │
│   - 30초마다 자동 refetch              │
└─────────────────────────────────────────┘
    ↓ (캐시 miss)
┌─────────────────────────────────────────┐
│ 2️⃣ 서버 캐시 (Next.js Data Cache)     │
│   - 디스크/메모리 캐시                  │
│   - revalidate: 30초                   │
│   - 모든 사용자 공유                    │
└─────────────────────────────────────────┘
    ↓ (캐시 miss)
┌─────────────────────────────────────────┐
│ 3️⃣ DART API                           │
│   - 실제 공시 데이터                    │
└─────────────────────────────────────────┘
```

### 시나리오별 동작

#### 시나리오 1: 첫 방문 (Cold Start)

```
사용자 A (0초) → DART API 호출 (300ms)
  → 서버 캐시 저장 (30초 유효)
  → 클라이언트 캐시 저장 (30초 fresh)
  → 화면 렌더링 (총 ~500ms)
```

#### 시나리오 2: 10초 후 다른 사용자

```
사용자 B (10초) → 서버 캐시 HIT ✅ (50ms)
  → 클라이언트 캐시 저장
  → 화면 렌더링 (총 ~100ms)
```

#### 시나리오 3: 30초 후 자동 갱신

```
사용자 A (30초) → refetchInterval 트리거
  → DART API 재호출
  → 캐시 갱신
  → 화면 자동 업데이트
```

### 캐싱 효과

- **DART API 호출 감소**: 98%
  - 캐싱 없음: 100명 × 2회/분 = 200회/분
  - 캐싱 적용: 2회/분 (30초당 1회)

- **응답 속도**:
  - 첫 요청: ~500ms
  - 서버 캐시: ~100ms
  - 클라이언트 캐시: ~10ms

---

## API 구조

### DART Open API

**엔드포인트**: `https://opendart.fss.or.kr/api/list.json`

**파라미터**:

```typescript
{
  crtfc_key: string // API 인증키
  bgn_de: string // 시작일 (YYYYMMDD)
  end_de: string // 종료일 (YYYYMMDD)
  corp_cls: string // 법인구분 (Y/K/N/E)
  sort: 'date' // 정렬 기준
  sort_mth: 'desc' // 정렬 방법
  page_count: 100 // 페이지당 건수
}
```

**응답**:

```typescript
{
  status: "000",         // 000: 정상
  message: "정상",
  total_count: 305,
  list: [
    {
      corp_code: "00107598",
      corp_name: "남양유업",
      stock_code: "003920",
      corp_cls: "Y",
      report_nm: "횡령ㆍ배임사실확인",
      rcept_no: "20260129801107",
      flr_nm: "남양유업",
      rcept_dt: "20260129",
      rm: "유"
    },
    // ...
  ]
}
```

### 내부 API

**엔드포인트**: `/api/disclosures/today`

**쿼리 파라미터**:

```typescript
{
  market: 'all' | 'kospi' | 'kosdaq' | 'konex'
}
```

**응답**:

```typescript
{
  disclosures: Disclosure[],
  totalCount: number,
  lastUpdated: string  // ISO 8601
}
```

---

## 사용 방법

### 1. 환경 설정

**.env.local**:

```bash
DART_API_KEY=your_api_key_here
```

DART API 키 발급: https://opendart.fss.or.kr

### 2. 페이지에서 사용

```tsx
import { Suspense } from 'react'
import { TodayDisclosures } from '@/widgets/today-disclosures'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodayDisclosures />
    </Suspense>
  )
}
```

**주의**: `useSearchParams()` 사용으로 `<Suspense>` 필수

### 3. 개별 컴포넌트 사용

```tsx
// React Query hook만 사용
import { useTodayDisclosures } from '@/entities/disclosure'

function MyComponent() {
  const { data, isLoading } = useTodayDisclosures('kospi')

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {data?.disclosures.map(disclosure => (
        <div key={disclosure.id}>{disclosure.title}</div>
      ))}
    </div>
  )
}
```

---

## 트러블슈팅

### 1. `date.getTime is not a function` 에러

**원인**: JSON 직렬화 후 Date가 string으로 변환됨

**해결**:

```typescript
// ❌ 잘못된 방법
interface Disclosure {
  receivedAt: Date // JSON 직렬화 후 string이 됨
}

// ✅ 올바른 방법
interface Disclosure {
  receivedAt: string // ISO string
}

// 사용 시
const date = new Date(disclosure.receivedAt)
```

### 2. 시간 정보가 없음 (00:00 표시)

**원인**: DART Open API는 날짜만 제공 (시간 없음)

**해결**: 시간 컬럼을 날짜로 변경하거나 제거

```typescript
// DART API 응답
{
  rcept_dt: "20260129",  // 날짜만
  rcept_no: "20260129801107"  // 순번 (시간 아님)
}
```

### 3. 캐시 무효화

**클라이언트 캐시**:

```typescript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: ['disclosures', 'today'] })
```

**서버 캐시**:

```typescript
import { revalidateTag } from 'next/cache'

revalidateTag('disclosures')
```

### 4. Suspense 경고

**에러**: `useSearchParams() should be wrapped in a suspense boundary`

**해결**:

```tsx
// ❌ 잘못된 사용
<TodayDisclosures />

// ✅ 올바른 사용
<Suspense fallback={<Loading />}>
  <TodayDisclosures />
</Suspense>
```

### 5. 테이블 레이아웃이 흔들림

**원인**: 컬럼 비율 미고정

**해결**:

```tsx
// table에 table-fixed 추가
<table className="w-full table-fixed">
  <th className="w-[10%]">컬럼</th>
</table>
```

---

## 성능 최적화

### 이미 적용된 최적화

1. **2단계 캐싱**: 서버 + 클라이언트
2. **자동 갱신**: 30초마다 백그라운드 refetch
3. **백그라운드 중지**: 탭 비활성화 시 요청 중지
4. **반응형 분기**: 모바일/PC 최적화
5. **테이블 고정**: `table-fixed`로 레이아웃 안정성

### 추가 최적화 가능

1. **가상 스크롤**: 공시 개수 증가 시
2. **이미지 최적화**: 로고 등 추가 시
3. **무한 스크롤**: 페이지네이션 대신

---

## 향후 개선 사항

### 기능 추가

- [ ] 공시 유형별 필터링
- [ ] 검색 기능
- [ ] 북마크/즐겨찾기
- [ ] 알림 기능 (새 공시)
- [ ] 공시 상세 모달

### 기술 개선

- [ ] 웹소켓 실시간 연동 (가능 시)
- [ ] 가상 스크롤 (react-window)
- [ ] 테스트 코드 작성
- [ ] Storybook 추가

---

## 참고 자료

- [DART Open API 문서](https://opendart.fss.or.kr/guide/main.do)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [FSD 아키텍처](https://feature-sliced.design/)

---

**문서 작성일**: 2026-01-29
**마지막 업데이트**: 2026-01-29
**버전**: 1.0.0
