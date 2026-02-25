# 공시 AI 요약 기획서

## 개요

사용자가 특정 공시의 "AI 요약" 버튼을 클릭하면, DART에서 공시 원문을 가져와 AI가 요약 분석한 결과를 모달로 보여주는 기능이다.
요약 결과는 **사용자 개인 DB에 저장**되며, 마이페이지에서 다시 확인할 수 있다.

### 핵심 요구사항

- **로그인 필수**: 인증된 사용자만 AI 요약 사용 가능
- **사용자별 개인 저장**: 요약은 사용자 개인 DB에 저장 (공유 캐시 없음)
- **시점별 차이 반영**: AI 요약은 생성 시점의 맥락에 따라 달라질 수 있으므로 사용자마다 독립 생성
- **히스토리**: 마이페이지 목록 + 공시 목록에서 요약 완료 뱃지 표시
- **1차 범위**: 정기공시(사업보고서/분반기보고서)만 지원, 이후 확장

---

## AI 요약 지원 공시 유형

현재 지원 여부는 `features/ai-disclosure-summary/ui/ai-summary-button.tsx`의 `SUPPORTED_TYPES`에서 관리한다.

| 코드 | 유형         | 지원 여부          | 비고                        |
| ---- | ------------ | ------------------ | --------------------------- |
| A    | 정기공시     | **지원** (Phase 1) | 사업보고서, 반기/분기보고서 |
| B    | 주요사항보고 | 미지원             | Phase 3 예정                |
| C    | 발행공시     | 미지원             | Phase 3 예정                |
| D    | 지분공시     | 미지원             |                             |
| E    | 기타공시     | 미지원             |                             |
| F    | 외부감사관련 | 미지원             |                             |
| G    | 펀드공시     | 미지원             |                             |
| H    | 자산유동화   | 미지원             |                             |
| I    | 거래소공시   | 미지원             |                             |
| J    | 공정위공시   | 미지원             |                             |

> 새 유형을 추가할 때는 `SUPPORTED_TYPES`에 코드를 추가하고, 필요 시 `build-prompt.ts`의 프롬프트를 유형별로 분기한다.

---

## 사용자 플로우

### 사전 확인 (공시 목록 렌더링 시)

```
1. 공시 목록 로드 시 → 로그인 사용자의 요약 상태 조회
   ├─ GET /api/user/disclosure-summaries/ids
   └─ 응답: 해당 사용자가 요약한 rceptNo 목록
   ↓
2. 버튼 상태 분기
   ├─ 내가 요약한 공시   → [AI 요약 ✓] 완료 뱃지 (클릭 시 저장된 요약 즉시 표시)
   ├─ 요약하지 않은 공시 → [AI 요약] 기본 버튼 (클릭 시 생성 플로우)
   └─ 지원하지 않는 유형 → 버튼 비표시
```

### AI 요약 생성/조회 (버튼 클릭 시)

```
1. 사용자가 [AI 요약] 버튼 클릭
   ↓
2. 로그인 여부 확인 (미로그인 → 로그인 유도 모달)
   ↓
3. ResponsiveModal 열림 (모바일: 바텀시트, PC: 다이얼로그)
   ↓
4-a. 내가 이미 요약한 공시 → 내 DB에서 즉시 조회 + 결과 표시
4-b. 처음 요약하는 공시 → 단계별 프로그레스 표시
     ├─ Step 1: "공시 원문 다운로드 중..." (DART ZIP 다운로드)
     ├─ Step 2: "문서 분석 중..." (텍스트 추출 + 전처리)
     └─ Step 3: "AI 요약 생성 중..." (Gemini API 호출)
   ↓
5. 요약 결과 표시 (간단/상세 토글 가능)
   ↓
6. 내 DB에 자동 저장
   ↓
7. 공시 목록의 해당 항목 버튼 상태 → [AI 요약 ✓] 로 업데이트
```

---

## 요약 출력 형식

### 간단 요약 (기본)

| 항목      | 설명                                             |
| --------- | ------------------------------------------------ |
| 핵심 요약 | 공시 내용을 3~5문장으로 요약                     |
| 감성 분석 | 호재 / 악재 / 중립 뱃지                          |
| 핵심 수치 | 공시에서 추출한 주요 숫자 데이터 (매출, 이익 등) |

### 상세 요약

| 항목        | 설명                                               |
| ----------- | -------------------------------------------------- |
| 핵심 요약   | 간단 요약과 동일                                   |
| 감성 분석   | 호재 / 악재 / 중립 + 판단 근거                     |
| 핵심 수치   | 주요 재무 수치 테이블                              |
| 상세 분석   | 공시 내용의 구조화된 분석 (배경, 내용, 영향, 전망) |
| 투자자 영향 | 주가/배당/지분 등에 미치는 영향 분석               |

---

## 공시 원문 데이터 소스

### DART 문서 API (ZIP)

기존 잠정실적 파서(`entities/company/api/financials/provisional.ts`)와 동일한 패턴으로 DART Document API를 사용한다.

```
[API 호출] downloadDocument(rceptNo)
   ↓
[ZIP Buffer 수신] 공시 문서 ZIP 파일
   ↓
[압축 해제] HTML/XML 파일 추출
   ↓
[텍스트 추출] HTML 태그 제거, 본문 텍스트만 추출
   ↓
[전처리] 토큰 제한에 맞게 텍스트 트리밍 (약 8,000자)
   ↓
[Gemini API] 요약 생성
```

### 선택 근거

- 공식 API 기반으로 안정적
- 기존 `shared/lib/dart/client.ts`의 `downloadDocument()` 재사용
- 잠정실적 파서에서 검증된 ZIP 파싱 로직 활용
- HTML 크롤링 대비 구조 변경에 덜 취약

---

## DB 스키마

### 공시 식별 방식

공시의 고유 식별자는 DART의 **`rceptNo` (접수번호)**이다. (예: `"20240129000123"`)

현재 공시 목록은 DART API에서 실시간으로 가져와 렌더링하므로, 우리 DB에 해당 공시 레코드가 없을 수 있다.
따라서 AI 요약 최초 요청 시 **Stock → Disclosure 레코드를 on-demand로 생성(upsert)**한다.

```
[최초 요약 요청 시 DB 레코드 생성 흐름]

1. Stock.upsert({ where: { corpCode }, create: { corpCode, corpName, stockCode, market } })
   → 이미 있으면 그대로 사용, 없으면 생성
   ↓
2. Disclosure.upsert({ where: { rceptNo }, create: { rceptNo, stockId, reportNm, dcmType, rceptDt, dartUrl } })
   → 이미 있으면 그대로 사용, 없으면 생성
   ↓
3. AI 요약 생성 후 → UserDisclosureSummary에 사용자 개인 요약 저장
```

### 기존 모델 (변경 없음)

Disclosure 모델의 AI 필드(`aiSummary`, `aiSentiment` 등)는 이 기능에서 사용하지 않는다.
공시 메타데이터 저장 용도로만 활용한다.

```prisma
model Stock {
  id        String  @id @default(uuid()) @db.Uuid
  stockCode String  @unique @map("stock_code") @db.VarChar(10)
  corpCode  String  @unique @map("corp_code") @db.VarChar(8)  // ← upsert 키
  corpName  String  @map("corp_name") @db.VarChar(100)
  market    String? @db.VarChar(20)
  // ...
}

model Disclosure {
  id            String   @id @default(uuid()) @db.Uuid
  stockId       String   @map("stock_id") @db.Uuid           // FK → Stock
  rceptNo       String   @unique @map("rcept_no") @db.VarChar(20) // ← 공시 고유 식별자
  rceptDt       DateTime @map("rcept_dt") @db.Date
  reportNm      String   @map("report_nm") @db.VarChar(500)
  dcmType       String?  @map("dcm_type") @db.VarChar(10)
  dartUrl       String?  @map("dart_url") @db.VarChar(500)
  // 기존 AI 필드는 그대로 두되 이 기능에서는 사용하지 않음
  // ...
}
```

### 신규 모델: UserDisclosureSummary (사용자별 개인 요약)

기존의 "보관함" 역할에서 **요약 내용 자체를 저장**하는 테이블로 확장한다.

```prisma
model UserDisclosureSummary {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @map("user_id") @db.Uuid
  disclosureId  String   @map("disclosure_id") @db.Uuid
  summary       String   @map("summary") @db.Text              // 핵심 요약 (3~5문장)
  sentiment     String   @map("sentiment") @db.VarChar(20)     // positive | negative | neutral
  keyFigures    Json     @map("key_figures")                    // [{ label, value, change }]
  analysis      String?  @map("analysis") @db.Text             // 상세 분석 (Phase 3)
  createdAt     DateTime @default(now()) @map("created_at")    // 요약 생성 시각

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  disclosure Disclosure @relation(fields: [disclosureId], references: [id], onDelete: Cascade)

  @@unique([userId, disclosureId])
  @@index([userId])
  @@index([disclosureId])
  @@map("user_disclosure_summaries")
}
```

### 역할 분리

| 테이블                  | 역할                               | 키                               |
| ----------------------- | ---------------------------------- | -------------------------------- |
| `Stock`                 | 기업 정보 (on-demand 생성)         | `corpCode` (unique)              |
| `Disclosure`            | 공시 메타데이터 (on-demand 생성)   | `rceptNo` (unique)               |
| `UserDisclosureSummary` | **사용자별 AI 요약 내용 + 보관함** | `userId + disclosureId` (unique) |

### 이전 설계와의 차이

|                       | 이전 (공유 캐시)                      | 현재 (사용자별 저장)                     |
| --------------------- | ------------------------------------- | ---------------------------------------- |
| 요약 저장 위치        | `Disclosure.aiSummary` (공유)         | `UserDisclosureSummary.summary` (개인)   |
| 같은 공시 다른 사용자 | 캐시 재사용 (AI 호출 0회)             | 각각 AI 호출 (사용자당 1회)              |
| 시점 차이             | 최초 생성 시점으로 고정               | 사용자 요청 시점 반영                    |
| 요약 완료 판별        | `Disclosure.aiAnalyzedAt IS NOT NULL` | `UserDisclosureSummary WHERE userId = ?` |

---

## API 설계

### 0. 사용자의 요약 완료 공시 목록 (사전 조회)

```
GET /api/user/disclosure-summaries/ids
```

**설명**: 로그인 사용자가 이미 요약한 공시의 `rceptNo` 목록을 반환한다. 공시 목록 렌더링 시 버튼 상태 결정에 사용.

**응답**:

```typescript
interface UserSummaryIdsResponse {
  rceptNos: string[] // 사용자가 요약한 공시 접수번호 목록
}
```

**처리 로직**:

1. 인증 필수 (Supabase 세션 → userId)
2. `UserDisclosureSummary` JOIN `Disclosure`에서 해당 userId의 rceptNo 목록 조회
3. 비로그인 시 빈 배열 반환

**캐싱**: React Query `staleTime: 5분`

---

### 1. AI 요약 생성/조회

```
POST /api/disclosures/[rceptNo]/ai-summary
```

**요청 Body** (공시 메타데이터 — Stock/Disclosure upsert에 사용):

```typescript
interface AiDisclosureSummaryRequest {
  corpCode: string // DART 기업 고유번호 (Stock upsert 키)
  corpName: string // 기업명
  stockCode: string // 종목코드
  market?: string // KOSPI, KOSDAQ 등
  reportName: string // 공시 제목
  disclosureType?: string // 공시 유형 (A, B, C...)
  receivedAt: string // 접수일자
  dartUrl?: string // DART 원문 링크
}
```

> 클라이언트가 공시 목록에서 이미 보유한 데이터를 body로 전달하므로 서버가 별도 조회할 필요 없음

**응답**:

```typescript
interface AiDisclosureSummaryResponse {
  summary: string // 핵심 요약 (3~5문장)
  sentiment: 'positive' | 'negative' | 'neutral' // 감성 분석
  keyFigures: KeyFigure[] // 핵심 수치
  analysis: string | null // 상세 분석 (상세 모드일 때만)
  createdAt: string // 요약 생성 시각 (ISO 8601)
  isExisting: boolean // 기존 저장된 요약 여부
}

interface KeyFigure {
  label: string // "매출액", "영업이익" 등
  value: string // "333.6조원", "+10.8%" 등
  change?: string // 전기 대비 변화
}
```

**처리 로직**:

1. 인증 확인 (Supabase 세션 → userId)
2. `UserDisclosureSummary.findUnique({ where: { userId_disclosureId } })` 조회
3. **이미 저장된 요약 존재**:
   → 저장된 요약 반환 (`isExisting: true`)
4. **저장된 요약 없음**:
   → Stock upsert (corpCode 기준)
   → Disclosure upsert (rceptNo 기준, body의 메타데이터 사용)
   → DART ZIP 다운로드 → 텍스트 추출 → Gemini 호출
   → `UserDisclosureSummary.create({ userId, disclosureId, summary, sentiment, keyFigures })`
   → 결과 반환 (`isExisting: false`)

### 2. 사용자 보관함 목록

```
GET /api/user/disclosure-summaries?page=1&limit=20
```

**응답**:

```typescript
interface UserSummaryListResponse {
  items: {
    id: string // UserDisclosureSummary ID
    rceptNo: string // 공시 접수번호
    reportName: string // 공시 제목
    companyName: string // 기업명
    sentiment: string // positive | negative | neutral
    summaryPreview: string // 요약 미리보기 (50자)
    createdAt: string // 요약 생성 시각
  }[]
  totalCount: number
  hasMore: boolean
}
```

---

## UI 설계

### 1. AI 요약 버튼

공시 목록의 각 항목에 [AI 요약] 버튼을 추가한다.

```
┌─────────────────────────────────────────────────┐
│  [유] 삼성전자   2024년 사업보고서   [AI 요약]   │
│                                          01.29   │
└─────────────────────────────────────────────────┘
```

**상태별 표시:**

- 요약 가능: `AI 요약` 텍스트 버튼 (기본)
- 내가 요약 완료: `AI 요약 ✓` 뱃지 (클릭 시 저장된 요약 즉시 표시)
- 지원하지 않는 공시 유형: 버튼 비표시
- 미로그인: 버튼 클릭 시 로그인 유도

### 2. 요약 모달 (ResponsiveModal)

기존 `@gs/ui`의 `ResponsiveModal` 사용 (모바일: 바텀시트, PC: 다이얼로그)

#### 로딩 상태 (단계별 프로그레스)

```
┌─────────────────────────────────────────┐
│  AI 공시 요약                     [X]   │
├─────────────────────────────────────────┤
│                                         │
│        ○ 공시 원문 다운로드 중...       │
│        ○ 문서 분석 중                   │
│        ○ AI 요약 생성 중                │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━░░░░░░░░  60%      │
│                                         │
└─────────────────────────────────────────┘
```

#### 완료 상태 (간단 모드)

```
┌─────────────────────────────────────────┐
│  AI 공시 요약                     [X]   │
│  삼성전자 | 2024년 사업보고서           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ 감성 분석 ──────────────────────┐   │
│  │  🟢 호재                          │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ 핵심 요약 ──────────────────────┐   │
│  │  삼성전자는 2024년 매출 333.6조원  │   │
│  │  으로 전년 대비 10.8% 성장했으며   │   │
│  │  ...                               │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ 핵심 수치 ──────────────────────┐   │
│  │  매출액     333.6조원  (+10.8%)    │   │
│  │  영업이익    42.3조원  (+15.2%)    │   │
│  │  순이익      31.2조원  (+12.1%)    │   │
│  └──────────────────────────────────┘   │
│                                         │
│        [간단] ──●── [상세]              │
│                                         │
│  ─────────────────────────────────────  │
│  ⚠️ AI가 생성한 요약입니다.             │
│  투자 판단의 근거로 사용하지 마세요.     │
│  생성: 2026-02-20 14:30                 │
└─────────────────────────────────────────┘
```

#### 완료 상태 (상세 모드)

간단 모드의 내용 + 아래 섹션 추가:

```
│  ┌─ 상세 분석 ──────────────────────┐   │
│  │  ■ 배경                           │   │
│  │  반도체 시장 회복과 AI 수요 증가   │   │
│  │  ...                               │   │
│  │                                    │   │
│  │  ■ 주요 내용                       │   │
│  │  HBM 매출 비중 확대, 파운드리      │   │
│  │  수율 개선...                      │   │
│  │                                    │   │
│  │  ■ 투자자 영향                     │   │
│  │  반도체 업황 회복에 따른 실적       │   │
│  │  개선 기대감...                    │   │
│  └──────────────────────────────────┘   │
```

### 3. 마이페이지 보관함

```
┌─────────────────────────────────────────┐
│  내 AI 요약 보관함                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ 🟢 삼성전자 | 2024년 사업보고서   │   │
│  │ 매출 333.6조원으로 전년 대비...   │   │
│  │                       2026.02.20  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ 🔴 SK하이닉스 | 자사주 처분...    │   │
│  │ 자사주 500만주 처분 결정으로...   │   │
│  │                       2026.02.19  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ...                                    │
└─────────────────────────────────────────┘
```

---

## 기술 스택

| 항목      | 기술                         |
| --------- | ---------------------------- |
| AI 모델   | Google Gemini 2.5 Flash Lite |
| 공시 원문 | DART Document API (ZIP)      |
| DB        | PostgreSQL (Prisma)          |
| 인증      | Supabase Auth                |
| 상태 관리 | TanStack Query (useMutation) |
| UI        | ResponsiveModal (@gs/ui)     |
| 문서 파싱 | adm-zip + node-html-parser   |

---

## 프롬프트 설계

### 간단 요약 프롬프트

```
[시스템]
한국 주식 시장 전문 애널리스트입니다.
공시 원문을 읽고 개인 투자자가 빠르게 이해할 수 있도록 요약합니다.

[입력]
- 기업명: {companyName}
- 공시 제목: {reportName}
- 공시 유형: {disclosureType}
- 공시 원문: {documentText}

[출력 형식 - JSON]
{
  "summary": "핵심 요약 3~5문장",
  "sentiment": "positive | negative | neutral",
  "sentimentReason": "감성 판단 근거 1문장",
  "keyFigures": [
    { "label": "항목명", "value": "수치", "change": "변화율" }
  ]
}

[규칙]
- 전문 용어는 쉬운 표현으로 풀어서 설명
- 수치는 원 단위를 조/억 단위로 변환
- 투자 추천이나 매수/매도 의견은 절대 제시하지 않음
- 객관적 사실 위주로 서술
```

### 상세 분석 프롬프트

간단 요약 프롬프트에 추가:

```
[추가 출력]
{
  "analysis": {
    "background": "공시 배경 및 맥락",
    "content": "주요 내용 상세",
    "impact": "투자자에게 미치는 영향",
    "outlook": "향후 전망"
  }
}
```

---

## FSD 구조

```
features/
  ai-disclosure-summary/
    api/
      generate-summary.ts      # 서버: DART ZIP 다운로드 + Gemini 호출 + DB 저장
      client.ts                # 클라이언트: API 호출 함수
    lib/
      build-prompt.ts          # 프롬프트 빌더 (간단/상세)
      extract-document-text.ts # ZIP에서 텍스트 추출
    model/
      types.ts                 # 타입 정의
    queries/
      hooks.ts                 # useMutation, useQuery 훅
    ui/
      ai-summary-button.tsx    # 공시 목록용 AI 요약 버튼
      ai-summary-modal.tsx     # 요약 결과 모달 (ResponsiveModal)
      summary-progress.tsx     # 단계별 프로그레스 UI
      summary-content.tsx      # 요약 내용 표시 (간단/상세 토글)
      summary-card.tsx         # 마이페이지 보관함 카드
    index.ts                   # public API

app/
  api/
    disclosures/
      [rceptNo]/
        ai-summary/
          route.ts             # POST: AI 요약 생성/조회
    user/
      disclosure-summaries/
        route.ts               # GET: 보관함 목록
        ids/
          route.ts             # GET: 사용자의 요약 완료 rceptNo 목록
```

---

## 데이터 흐름

### 1단계: 공시 목록 렌더링 (사전 확인)

```
[공시 목록 로드]
    ↓
[클라이언트] useQuery → GET /api/user/disclosure-summaries/ids
    ↓
[서버] UserDisclosureSummary JOIN Disclosure → 해당 userId의 rceptNo 목록
    ↓
[클라이언트] 버튼 상태 결정
    ├─ 내 요약 존재 → [AI 요약 ✓] 완료 뱃지
    └─ 내 요약 없음 → [AI 요약] 기본 버튼
```

### 2단계: AI 요약 생성/조회 (버튼 클릭)

```
[사용자 클릭] "AI 요약" 버튼
    ↓
[클라이언트] 로그인 확인 (미로그인 → 로그인 유도)
    ↓
[클라이언트] useMutation → POST /api/disclosures/{rceptNo}/ai-summary
             (body: { corpCode, corpName, stockCode, reportName, ... })
    ↓
[서버] 인증 확인 (Supabase → userId)
    ↓
[서버] Disclosure.findUnique({ where: { rceptNo } }) → disclosureId 확보
    ↓
[서버] UserDisclosureSummary.findUnique({ where: { userId_disclosureId } })
    ↓
    ├─ [내 요약 존재] → 저장된 요약 반환 (isExisting: true)
    │
    └─ [내 요약 없음] → 새로 생성
        ↓
       Stock.upsert({ where: { corpCode } })       ← 기업 레코드 확보
        ↓
       Disclosure.upsert({ where: { rceptNo } })   ← 공시 레코드 확보
        ↓
       DART downloadDocument(rceptNo)               ← ZIP 다운로드
        ↓
       ZIP 압축 해제 → HTML/XML 텍스트 추출
        ↓
       Gemini API 호출 (buildPrompt)
        ↓
       UserDisclosureSummary.create({ userId, disclosureId, summary, sentiment, keyFigures })
        ↓
       결과 반환 (isExisting: false)
    ↓
[클라이언트] 모달에 요약 표시
    ↓
[클라이언트] 요약 ID 목록 캐시 무효화 → 해당 공시 버튼 [AI 요약 ✓] 로 업데이트
```

---

## 환경변수

```env
# 기존
GEMINI_API_KEY=<Google AI Studio에서 발급>
DART_API_KEY=<DART API 인증키>

# 신규 없음 (기존 환경변수 재사용)
```

---

## 캐싱 전략

| 레벨        | 대상                  | TTL                          | 설명                                    |
| ----------- | --------------------- | ---------------------------- | --------------------------------------- |
| DB          | UserDisclosureSummary | 영구                         | 사용자별 요약은 영구 보관               |
| React Query | 요약 결과             | 무제한 (staleTime: Infinity) | 내 요약이 한번 생성되면 변하지 않으므로 |
| React Query | 보관함 목록           | 5분                          | 새 요약 생성 시 목록 갱신               |
| React Query | 요약 ID 목록          | 5분                          | 공시 목록 뱃지 표시용                   |

---

## 비용 추정

- **Gemini Flash Lite**: 무료 티어 15 RPM, 100만 토큰/일
- 공시 원문 평균 길이: ~5,000~20,000자 → 트리밍 후 ~8,000자
- 1회 요청 예상: 입력 ~3,000 토큰 + 출력 ~800 토큰 = ~3,800 토큰
- **공유 캐시 없이 사용자마다 AI 호출 발생** → 동일 공시라도 사용자 수만큼 호출
- 하루 사용자 50명 × 평균 3건 = 150건 → ~57만 토큰 (무료 범위 내)
- RPM 제한(15회/분) 주의: 동시 요청이 몰릴 경우 큐잉 필요할 수 있음

---

## 개발 단계

### Phase 1: 핵심 기능 (MVP)

- [ ] DB 마이그레이션 (UserDisclosureSummary 모델에 요약 필드 추가)
- [ ] DART ZIP 다운로드 + 텍스트 추출 로직
- [ ] Gemini 프롬프트 (간단 요약만)
- [ ] API 라우트 (POST /api/disclosures/[rceptNo]/ai-summary)
- [ ] API 라우트 (GET /api/user/disclosure-summaries/ids)
- [ ] AI 요약 모달 UI (ResponsiveModal)
- [ ] 공시 목록에 AI 요약 버튼 추가
- [ ] 단계별 프로그레스 로딩 UI
- [ ] 정기공시(A타입)만 지원

### Phase 2: 보관함 & 히스토리

- [ ] 마이페이지 보관함 API (GET /api/user/disclosure-summaries)
- [ ] 마이페이지 보관함 UI
- [ ] 공시 목록 요약 완료 뱃지 연동

### Phase 3: 상세 분석 & 확장

- [ ] 상세 분석 프롬프트 추가
- [ ] 간단/상세 토글 UI
- [ ] 주요사항보고(B), 발행공시(C) 등 추가 지원
- [ ] 사용량 제한 (필요 시)

---

## 에러 처리

| 에러 상황                  | 처리                                           |
| -------------------------- | ---------------------------------------------- |
| 미로그인                   | 로그인 유도 모달 표시                          |
| DART API 실패              | "공시 원문을 가져올 수 없습니다" + 재시도 버튼 |
| ZIP 파싱 실패              | "문서 형식을 분석할 수 없습니다"               |
| Gemini API 실패            | "AI 요약 생성에 실패했습니다" + 재시도 버튼    |
| 지원하지 않는 공시 유형    | 버튼 비표시 (사전 차단)                        |
| 텍스트 추출 실패 (빈 문서) | "요약할 내용이 충분하지 않습니다"              |

---

## 성능 목표

| 지표                 | 목표                        |
| -------------------- | --------------------------- |
| 저장된 요약 조회     | < 500ms                     |
| 신규 요약 생성       | < 15초 (DART 다운로드 + AI) |
| 모달 오픈            | < 100ms                     |
| 마이페이지 목록 로드 | < 1초                       |

---

## 참고 자료

- [AI 기업 요약 기획서](../company-detail/ai-company-summary.md)
- [공시 목록 페이지 기획서](./disclosure-list-page.md)
- [DART Open API 문서](https://opendart.fss.or.kr/guide/main.do)
- [Gemini API 문서](https://ai.google.dev/docs)

---

**최종 업데이트**: 2026-02-20
