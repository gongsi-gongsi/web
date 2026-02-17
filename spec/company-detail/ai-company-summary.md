# AI 기업 요약 기획안

## 개요

기업 상세 페이지 요약 탭 최상단에 AI가 생성한 기업 분석 요약을 표시한다.
재무 데이터와 최근 뉴스 제목을 결합하여 Gemini Flash API로 항목별 요약을 생성한다.

## 표시 위치

- 기업 상세 페이지 > 요약 탭 > 최상단
- 기존 수익성/성장성 차트 위에 AI 요약 카드 배치

## 출력 형식

3개 항목으로 구성:

| 항목      | 설명                | 예시                                                    |
| --------- | ------------------- | ------------------------------------------------------- |
| 재무 요약 | 최근 실적 추이 요약 | 매출 333.6조(+10.8%), 영업이익률 13.1%로 실적 개선 추세 |
| 주요 이슈 | 뉴스 기반 핵심 이슈 | HBM 수주 확대, 파운드리 수율 개선, 갤럭시 S25 출시      |
| 전망      | 재무+뉴스 종합 전망 | AI 반도체 수요 확대에 따른 메모리 사업 호조 전망        |

## 기술 스택

- **AI 모델**: Google Gemini Flash
- **캐싱**: Next.js `fetch` + `revalidate: 86400` (24시간)
- **DB**: 불필요 (Next.js 캐시 활용)

## 프롬프트 입력 데이터

### 1. 재무 데이터

- 최근 2~3개 분기 매출/영업이익/순이익
- 전년 동기 대비 성장률
- 주요 비율 (영업이익률, 순이익률, ROE)

### 2. 뉴스 제목

- Google News RSS에서 가져온 최근 20~30개 뉴스 제목

### 3. 기업 기본정보

- 회사명, 업종

## 데이터 흐름

```
[페이지 요청]
    ↓
[서버 컴포넌트]
    ├── 재무 데이터 조회 (DART API, 기존 캐시 활용)
    ├── 뉴스 제목 조회 (Google RSS, 기존 캐시 활용)
    └── Gemini API 호출 (revalidate: 86400)
    ↓
[AI 요약 카드 렌더링]
```

## API 설계

### Gemini API 호출

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

### 프롬프트 구조

```
[시스템]
한국 주식 시장 전문 애널리스트로서 기업 분석 요약을 작성하세요.

[입력 데이터]
- 기업명: {companyName}
- 업종: {industry}
- 재무 데이터: {financialData}
- 최근 뉴스 제목: {newsTitles}

[출력 형식]
1. 재무 요약: (1~2문장)
2. 주요 이슈: (1~2문장)
3. 전망: (1~2문장)
```

### 응답 타입

```typescript
interface AiCompanySummary {
  financial: string // 재무 요약
  issues: string // 주요 이슈
  outlook: string // 전망
  generatedAt: string // 생성 시각 (ISO 8601)
}
```

## UI 디자인

### AI 요약 카드

- 요약 탭 최상단에 카드 형태로 배치
- 각 항목은 아이콘 + 라벨 + 내용으로 구성
- 하단에 "AI가 생성한 요약입니다. 투자 판단의 근거로 사용하지 마세요." 면책 문구 표시
- 생성 시각 표시

### 로딩 상태

- Skeleton UI로 카드 영역 표시
- Suspense boundary로 감싸서 나머지 콘텐츠는 즉시 렌더링

### 에러 상태

- Gemini API 실패 시 카드 자체를 숨김 (기존 콘텐츠에 영향 없음)

## FSD 구조

```
features/
  ai-company-summary/
    api/
      generate-summary.ts    # Gemini API 호출 (서버 전용)
    ui/
      ai-summary-card.tsx    # AI 요약 카드 컴포넌트
    lib/
      build-prompt.ts        # 프롬프트 생성 유틸
    model/
      types.ts               # AiCompanySummary 타입
    index.ts                 # public API

shared/
  lib/
    gemini/
      client.ts              # Gemini API 클라이언트
      index.ts
```

## 환경변수

```
GEMINI_API_KEY=<Google AI Studio에서 발급>
```

## 캐싱 전략

- Gemini API 응답을 Next.js `fetch` 캐시로 24시간 보관
- 재무 데이터, 뉴스 RSS는 각각 기존 캐시 정책 유지
- 캐시 무효화: 자동 (24시간 후 다음 요청 시 재생성)

## 비용 추정

- Gemini Flash 무료 티어: 15 RPM, 100만 토큰/일
- 1회 요청 예상 토큰: 입력 ~1,000 + 출력 ~300 = ~1,300 토큰
- 하루 100개 기업 요약 시: ~13만 토큰 (무료 범위 내)
