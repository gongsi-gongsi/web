# 데이터베이스 ERD 및 설계 가이드

## 전체 관계도

```
User (사용자)
 ├─ 1:N ─→ Watchlist ←─ N:1 ─ Stock (관심종목 = 다대다 중간테이블)
 ├─ 1:N ─→ AiReport ←─ N:1 ─ Stock (AI 리포트 = 다대다 중간테이블)
 ├─ 1:N ─→ AiConversation ←─ N:1 ─ Disclosure (AI 대화)
 └─ 1:N ─→ Notification ←─ N:1 ─ Disclosure? (알림)

Stock (종목)
 ├─ 1:N ─→ Disclosure (공시)
 └─ 1:N ─→ FinancialData (재무 데이터)

SearchLog (검색 로그) ← 독립 테이블, FK 없음
```

---

## 테이블 상세

### 1. User (사용자)

```
users
├── id (PK, UUID)
├── email (UNIQUE, nullable) ← Supabase OAuth 연동
├── name
├── telegram_chat_id         ← 텔레그램 알림용
├── notification_email       ← 이메일 알림 ON/OFF
├── notification_telegram    ← 텔레그램 알림 ON/OFF
├── created_at
└── updated_at
```

**설계 의도:**

- `id`가 UUID인 이유 → Supabase Auth의 `auth.users.id`와 1:1 매핑. Supabase가 UUID를 사용하므로 동일하게 맞춤
- `email`이 nullable인 이유 → OAuth 로그인 시 이메일 제공이 선택적일 수 있음 (카카오 등)
- 알림 설정을 User에 직접 둔 이유 → 별도 Settings 테이블을 만들면 항상 JOIN이 필요하므로, 간단한 boolean은 User에 직접 배치하는 게 효율적

---

### 2. Stock (종목)

```
stocks
├── id (PK, UUID)
├── stock_code (UNIQUE) ← "005930" (거래소 종목코드)
├── corp_code (UNIQUE)  ← "00126380" (DART 고유번호)
├── corp_name           ← "삼성전자"
├── market              ← "KOSPI" | "KOSDAQ" | "KONEX"
├── sector              ← "반도체"
├── created_at
└── updated_at

인덱스: stock_code, corp_code, corp_name
```

**설계 의도:**

- **UNIQUE 키가 2개인 이유** → 한국 주식 시장에서 기업을 식별하는 키가 2가지 체계임
  - `stockCode` (종목코드): 거래소에서 사용 (예: 005930)
  - `corpCode` (DART 고유번호): 공시시스템에서 사용 (예: 00126380)
  - 공시 데이터는 `corpCode`로, 주가 데이터는 `stockCode`로 조회하므로 둘 다 필요
- **corp_name에 인덱스** → 검색 자동완성에서 기업명으로 LIKE 검색하기 때문
- **market이 nullable** → on-demand upsert 시 시장 정보를 모를 수 있음

---

### 3. Watchlist (관심종목)

```
watchlist
├── id (PK, UUID)
├── user_id (FK → users)
├── stock_id (FK → stocks)
├── notify_regular    ← 정기보고서 알림
├── notify_major      ← 주요사항보고 알림
├── notify_equity     ← 지분공시 알림
├── notify_securities ← 증권신고서 알림
├── priority          ← 정렬 우선순위
└── created_at

제약: UNIQUE(user_id, stock_id) ← 같은 종목 중복 등록 방지
```

**설계 의도:**

- **User ↔ Stock 다대다 관계의 중간 테이블** → 사용자가 여러 종목을, 한 종목을 여러 사용자가 관심 등록 가능
- **알림 설정을 중간 테이블에 둔 이유** → 종목별로 알림 유형을 다르게 설정할 수 있어야 함 (삼성전자는 정기공시만, SK하이닉스는 모든 공시 등)
- **Cascade 삭제** → 사용자나 종목이 삭제되면 관심 등록도 자동 삭제

---

### 4. Disclosure (공시)

```
disclosures
├── id (PK, UUID)
├── stock_id (FK → stocks)     ← 어떤 기업의 공시인지
├── rcept_no (UNIQUE)          ← DART 접수번호 = 공시의 자연키
├── rcept_dt                   ← 접수일자
├── report_nm                  ← "사업보고서 (2024.12)"
├── dcm_type                   ← "A"(정기), "B"(주요), "C"(발행)...
├── dart_url                   ← DART 원문 링크
├── ai_summary                 ← AI 요약 (캐시)
├── ai_sentiment               ← "positive" | "negative" | "neutral"
├── ai_key_figures (JSON)      ← [{ label, value, change }]
├── ai_analysis                ← 상세 분석 (캐시)
├── ai_analyzed_at             ← AI 분석 완료 시각 (NULL이면 미분석)
└── created_at

인덱스: stock_id, rcept_dt, dcm_type
```

**설계 의도:**

- **`rceptNo`가 UNIQUE인 이유** → DART에서 모든 공시에 부여하는 전역 고유번호. 이걸로 공시를 식별하고 문서를 다운로드함
- **AI 필드를 Disclosure에 직접 둔 이유** → AI 요약은 공시당 1개만 존재하는 1:1 관계. 별도 테이블로 분리하면 매번 JOIN 필요. 같은 row에 두면 단일 SELECT로 공시 정보 + AI 요약을 한번에 가져옴
- **`aiAnalyzedAt`의 역할** → NULL 여부로 "요약 완료/미완료"를 판별하는 플래그 역할. boolean 대신 DateTime을 쓴 이유는 "언제 분석했는지"도 알 수 있기 때문
- **`aiKeyFigures`가 JSON인 이유** → 공시마다 핵심 수치 항목이 다름 (정기공시는 매출/이익, 지분공시는 지분율 등). 정규화하기 어려운 가변 구조이므로 JSON이 적합
- **stock_id가 필수(not null)인 이유** → 모든 공시는 반드시 하나의 기업에 속함. DART 자체가 그런 구조

---

### 5. FinancialData (재무 데이터)

```
financial_data
├── id (PK, UUID)
├── stock_id (FK → stocks)
├── bsns_year          ← "2024"
├── reprt_code         ← "11011"(사업), "11012"(반기), "11013"(1Q), "11014"(3Q)
├── revenue            ← 매출액 (BigInt)
├── operating_profit   ← 영업이익
├── net_income         ← 당기순이익
├── total_assets       ← 자산총계
├── total_liabilities  ← 부채총계
├── total_equity       ← 자본총계
├── raw_data (JSON)    ← DART 원본 상세 데이터
└── created_at

제약: UNIQUE(stock_id, bsns_year, reprt_code) ← 종목+연도+보고서종류 조합 유일
```

**설계 의도:**

- **BigInt인 이유** → 대기업 매출이 수백조 원 단위. JS의 `Number`(약 9,000조)로는 안전하지 않은 값이 올 수 있으므로 BigInt 사용
- **복합 UNIQUE 키** → 삼성전자의 2024년 사업보고서 재무데이터는 하나만 존재해야 함. 이 3개 조합이 자연 복합키
- **`rawData` JSON** → DART API 원본 응답에는 계정 단위의 세부 데이터가 있음. 요약 6개 필드로 부족할 때 원본을 참고할 수 있도록 보관
- **재무 항목이 모두 nullable인 이유** → 기업에 따라 특정 항목이 없을 수 있음 (금융업은 매출액 대신 영업수익 등)

---

### 6. AiReport (AI 분석 리포트)

```
ai_reports
├── id (PK, UUID)
├── stock_id (FK → stocks)   ← 어떤 종목에 대한 리포트
├── user_id (FK → users)     ← 누가 요청했는지
├── report_type              ← "FULL" | "FINANCIAL" | "DIVIDEND"
├── report_content (JSON)    ← 리포트 전체 내용
└── created_at
```

**설계 의도:**

- **User와 Stock 모두 FK인 이유** → "사용자 A가 삼성전자에 대해 생성한 종합 리포트" 형태. Disclosure의 공시별 요약과 달리, 이건 종목 단위의 종합 분석
- **Disclosure가 아닌 Stock에 연결된 이유** → 특정 공시 1건이 아니라 종목 전체에 대한 분석이므로
- **`reportContent`가 JSON인 이유** → 리포트 타입(FULL, FINANCIAL, DIVIDEND)마다 구조가 다름. 정규화하면 테이블이 과도하게 분화됨

---

### 7. AiConversation (AI 대화)

```
ai_conversations
├── id (PK, UUID)
├── user_id (FK → users)
├── disclosure_id (FK → disclosures)  ← 어떤 공시에 대한 대화
├── role                              ← "USER" | "ASSISTANT"
├── content                           ← 대화 내용
└── created_at
```

**설계 의도:**

- **챗봇 대화 이력 패턴** → role(USER/ASSISTANT) + content로 대화 순서를 시간순 정렬하여 재구성
- **Disclosure에 연결된 이유** → "이 공시에 대해 더 질문하기" 기능을 위한 것. 공시 맥락 안에서의 후속 질문/답변
- **Stock이 아닌 Disclosure 연결** → AiReport(종목 단위)와의 차이점. 대화는 특정 공시 문맥에 묶임

---

### 8. Notification (알림)

```
notifications
├── id (PK, UUID)
├── user_id (FK → users)
├── disclosure_id (FK → disclosures, nullable)  ← 관련 공시 (있을 수도 없을 수도)
├── title
├── content
├── channel           ← "IN_APP" | "TELEGRAM" | "EMAIL"
├── is_read
└── sent_at

인덱스: user_id, disclosure_id, is_read
```

**설계 의도:**

- **disclosure_id가 nullable인 이유** → 모든 알림이 공시 관련은 아님 (시스템 공지, 서비스 알림 등)
- **onDelete: SetNull** → 공시가 삭제되어도 알림 기록은 유지 (Cascade가 아님). 사용자의 알림 히스토리 보존
- **is_read 인덱스** → "읽지 않은 알림 N건" 배지 표시에 `WHERE is_read = false` 조회가 빈번하므로
- **channel 필드** → 같은 알림을 여러 채널로 보낼 수 있고, 채널별로 발송 이력 추적

---

### 9. SearchLog (검색 로그)

```
search_logs
├── id (PK, autoincrement)  ← UUID가 아닌 정수
├── query                   ← 검색어
├── corp_code               ← 검색 결과로 선택한 기업 (nullable)
└── created_at

인덱스: created_at, (query + created_at), (corp_code + created_at)
```

**설계 의도:**

- **UUID 대신 autoincrement인 이유** → 로그성 데이터는 순서만 중요하고 외부 참조 없음. 정수 PK가 저장/인덱스 효율이 좋음
- **FK 없이 corp_code만 저장** → 검색 시점에 Stock 레코드가 없을 수 있고, 로그는 독립적이어야 함. FK 제약이 있으면 로그 INSERT가 실패할 수 있음
- **복합 인덱스 (query + created_at)** → "인기 검색어" 집계에 사용. 최근 N시간 내 검색어별 count를 빠르게 조회
- **복합 인덱스 (corp_code + created_at)** → 특정 기업의 검색 트렌드 분석용

---

## 전체 설계 원칙

| 원칙                       | 적용                                                    |
| -------------------------- | ------------------------------------------------------- |
| **모든 PK는 UUID**         | 분산 시스템 호환, Supabase Auth 연동 (SearchLog만 예외) |
| **자연키는 UNIQUE 인덱스** | rceptNo, stockCode, corpCode 등 외부 시스템 식별자      |
| **snake_case 매핑**        | Prisma의 camelCase ↔ DB의 snake_case를 `@map`으로 변환  |
| **Cascade 삭제**           | 부모 삭제 시 자식도 삭제 (Notification만 SetNull 예외)  |
| **가변 구조는 JSON**       | aiKeyFigures, reportContent, rawData 등                 |
| **로그성 데이터는 독립**   | SearchLog는 FK 없이 값만 저장                           |

---

**최종 업데이트**: 2026-02-19
