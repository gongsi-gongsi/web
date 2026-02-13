# 기업 재무제표 컴포넌트

## 개요

기업 상세 페이지에서 재무제표 정보를 표시하는 컴포넌트입니다.

---

## 1. DART API

### 단일회사 주요계정

**엔드포인트**: `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json`

| 파라미터     | 필수 | 설명                                           |
| ------------ | ---- | ---------------------------------------------- |
| `crtfc_key`  | Y    | API 인증키                                     |
| `corp_code`  | Y    | 기업 고유번호 (8자리)                          |
| `bsns_year`  | Y    | 사업연도 (2015년 이후)                         |
| `reprt_code` | Y    | 11011(사업), 11012(반기), 11013(1Q), 11014(3Q) |

### 응답 예시

```json
{
  "status": "000",
  "message": "정상",
  "list": [
    {
      "bsns_year": "2023",
      "corp_code": "00126380",
      "stock_code": "005930",
      "account_nm": "매출액",
      "fs_div": "CFS",
      "sj_div": "IS",
      "thstrm_amount": "258935022000000",
      "frmtrm_amount": "302231061000000",
      "bfefrmtrm_amount": "279604799000000"
    }
  ]
}
```

### 주요 필드

| 필드               | 설명                               |
| ------------------ | ---------------------------------- |
| `fs_div`           | `CFS`: 연결, `OFS`: 별도           |
| `sj_div`           | `BS`: 재무상태표, `IS`: 손익계산서 |
| `account_nm`       | 계정과목명                         |
| `thstrm_amount`    | 당기 금액                          |
| `frmtrm_amount`    | 전기 금액                          |
| `bfefrmtrm_amount` | 전전기 금액                        |

---

## 2. 표시할 데이터

### 조회 기간

| 탭     | 조회 범위  | 설명                                |
| ------ | ---------- | ----------------------------------- |
| 연도별 | 최근 5년   | 사업보고서 기준 (reprt_code: 11011) |
| 분기별 | 최근 5분기 | 1Q, 반기, 3Q, 사업보고서 순환       |

### 분기 보고서 코드

| reprt_code | 설명        | 시기              |
| ---------- | ----------- | ----------------- |
| `11013`    | 1분기보고서 | 5월               |
| `11012`    | 반기보고서  | 8월               |
| `11014`    | 3분기보고서 | 11월              |
| `11011`    | 사업보고서  | 3월 (전년도 실적) |

### 데이터 조회 전략

```typescript
// 연도별: 최근 5년
// API가 당기/전기/전전기 3년치 제공하므로 2번 호출 필요
// 예: 2024년 호출 → 2024, 2023, 2022
//     2021년 호출 → 2021, 2020, 2019
// 중복 제거 후 최신 5년 사용

// 분기별: 최근 5분기
// 현재 시점 기준으로 가장 최근 발표된 5개 분기 조회
// 예: 2024년 11월 → 2024-3Q, 2024-반기, 2024-1Q, 2023-사업, 2023-3Q
```

### 주요 계정과목

| 항목       | account_nm                         | sj_div |
| ---------- | ---------------------------------- | ------ |
| 매출액     | `매출액` 또는 `영업수익`           | IS     |
| 영업이익   | `영업이익`                         | IS     |
| 당기순이익 | `당기순이익` 또는 `연결당기순이익` | IS     |
| 자산총계   | `자산총계`                         | BS     |
| 부채총계   | `부채총계`                         | BS     |
| 자본총계   | `자본총계`                         | BS     |

### 계정과목 매핑

```typescript
const ACCOUNT_MAPPING = {
  revenue: ['매출액', '영업수익', '수익(매출액)'],
  operatingProfit: ['영업이익', '영업이익(손실)'],
  netIncome: ['당기순이익', '연결당기순이익', '당기순이익(손실)'],
  totalAssets: ['자산총계'],
  totalLiabilities: ['부채총계'],
  totalEquity: ['자본총계', '자본총계(지배)'],
}
```

---

## 3. 타입 정의

```typescript
// DART API 응답
interface DartFinancialItem {
  bsns_year: string
  corp_code: string
  stock_code: string
  account_nm: string
  fs_div: 'CFS' | 'OFS'
  sj_div: 'BS' | 'IS'
  thstrm_amount: string
  frmtrm_amount: string
  bfefrmtrm_amount: string
}

interface DartFinancialResponse {
  status: string
  message: string
  list: DartFinancialItem[]
}

// 앱 내부 타입
type ReportCode = '11011' | '11012' | '11013' | '11014'

interface FinancialData {
  year: number
  quarter?: '1Q' | '2Q' | '3Q' | '4Q' // 분기별 조회 시
  reportCode: ReportCode
  revenue: number | null
  operatingProfit: number | null
  netIncome: number | null
  totalAssets: number | null
  totalLiabilities: number | null
  totalEquity: number | null
}

type ViewMode = 'yearly' | 'quarterly'
```

---

## 4. 컴포넌트 구조

```
widgets/
└── financial-statements/
    ├── ui/
    │   └── financial-statements.tsx
    ├── lib/
    │   └── format-financial.ts
    └── index.ts
```

### Props

```typescript
interface FinancialStatementsProps {
  corpCode: string
  initialMode?: ViewMode // 기본값: 'yearly'
}
```

### UI 구성

```
┌─────────────────────────────────────────────┐
│  [연도별]  [분기별]                          │  ← 탭 전환
├─────────────────────────────────────────────┤
│         2024   2023   2022   2021   2020    │  ← 연도별 (5년)
│  매출액   xxx    xxx    xxx    xxx    xxx   │
│  영업이익  xxx    xxx    xxx    xxx    xxx   │
│  ...                                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [연도별]  [분기별]                          │
├─────────────────────────────────────────────┤
│        24.3Q  24.2Q  24.1Q  23.4Q  23.3Q   │  ← 분기별 (5분기)
│  매출액   xxx    xxx    xxx    xxx    xxx   │
│  ...                                        │
└─────────────────────────────────────────────┘
```

- 연결재무제표 우선, 없으면 별도재무제표 사용
- 금액은 억 단위로 포맷팅
- 탭 전환 시 데이터 새로 조회

---

## 5. 데이터 흐름

```
컴포넌트 → React Query → Route Handler → DART API
                ↓
            캐시 (staleTime: 1일)
```

### Query Key

```typescript
// 연도별
;['financial', corpCode, 'yearly'][
  // 분기별
  ('financial', corpCode, 'quarterly')
]
```

### API 호출 로직

```typescript
// 연도별: 5년치 조회
async function fetchYearlyFinancials(corpCode: string) {
  const currentYear = new Date().getFullYear()

  // 2번 호출로 5년치 확보 (3년 + 3년, 중복 제거)
  const [recent, older] = await Promise.all([
    fetchDartApi(corpCode, currentYear, '11011'),
    fetchDartApi(corpCode, currentYear - 3, '11011'),
  ])

  // 병합 후 최신 5년만 반환
  return mergeAndSlice(recent, older, 5)
}

// 분기별: 최근 5분기 조회
async function fetchQuarterlyFinancials(corpCode: string) {
  const quarters = getRecentQuarters(5) // [{year: 2024, code: '11014'}, ...]

  const results = await Promise.all(quarters.map(q => fetchDartApi(corpCode, q.year, q.code)))

  return results
}
```

---

## 6. 에러 처리

| DART 상태 | 설명        | UI 처리            |
| --------- | ----------- | ------------------ |
| `000`     | 정상        | 데이터 표시        |
| `013`     | 데이터 없음 | "재무 데이터 없음" |
| 그 외     | API 에러    | "데이터 로드 실패" |
