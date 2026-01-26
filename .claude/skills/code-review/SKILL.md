# Code Review 스킬

PR 또는 변경된 코드에 대한 종합적인 코드 리뷰를 수행합니다.

## 사용법

```
/code-review              # 현재 브랜치의 변경사항 리뷰
/code-review PR번호       # 특정 PR 리뷰 (예: /code-review 3)
/code-review 파일경로     # 특정 파일 리뷰
```

## 리뷰 수행 방법

### 1. 변경사항 수집

PR 번호가 주어진 경우:

```bash
gh pr diff <PR번호>
```

파일 경로가 주어진 경우:

```bash
# 해당 파일 읽기
```

아무 인자가 없는 경우:

```bash
git diff HEAD~1
# 또는
git diff develop..HEAD
```

### 2. 리뷰 관점

아래 관점에서 코드를 분석하고 이슈를 분류합니다:

#### 🔴 CRITICAL (머지 전 반드시 수정)

- 보안 취약점 (SQL 인젝션, XSS, 인증 우회 등)
- 데이터 유출 가능성
- 프로덕션 장애 유발 가능성

#### 🟡 WARNING (빠른 시일 내 수정 권장)

- 성능 이슈 (N+1 쿼리, 불필요한 리렌더링 등)
- 에러 핸들링 미흡
- 메모리 누수 가능성
- 테스트 누락

#### 🟢 SUGGESTION (개선 권장)

- 코드 가독성 개선
- 리팩토링 제안
- 문서화 추가
- 베스트 프랙티스 적용

### 3. 프로젝트별 체크리스트

#### 보안

- [ ] Server Actions에 입력 검증 (Zod 등) 적용
- [ ] 인증/권한 체크 구현
- [ ] 환경변수 노출 여부 확인
- [ ] SQL 인젝션 방지 (Prisma 파라미터 바인딩)
- [ ] XSS 방지 (사용자 입력 이스케이프)
- [ ] CSRF 토큰 사용 (필요시)

#### 성능

- [ ] N+1 쿼리 문제 없음
- [ ] 불필요한 데이터 fetch 없음
- [ ] 적절한 인덱스 사용
- [ ] React 컴포넌트 불필요한 리렌더링 방지
- [ ] 이미지/에셋 최적화
- [ ] 번들 사이즈 영향 검토

#### 타입 안전성

- [ ] `any` 타입 사용 최소화
- [ ] 적절한 타입 가드 사용
- [ ] API 응답 타입 정의
- [ ] null/undefined 처리

#### 에러 핸들링

- [ ] try-catch 적절히 사용
- [ ] 사용자 친화적 에러 메시지
- [ ] 에러 로깅 (컨텍스트 포함)
- [ ] 에러 바운더리 사용 (React)

#### FSD 아키텍처 (프로젝트 규칙)

- [ ] 레이어 의존성 규칙 준수 (상위 → 하위만 import)
- [ ] entities는 features를 import 하지 않음
- [ ] shared는 다른 레이어를 import 하지 않음
- [ ] index.ts를 통한 barrel export 사용
- [ ] 파일/폴더명 kebab-case 사용

#### Next.js 패턴

- [ ] Server/Client 컴포넌트 적절히 분리
- [ ] 'use client' 최소화
- [ ] 적절한 캐싱 전략 (revalidate, tags)
- [ ] Server Actions에서 revalidatePath 사용
- [ ] 메타데이터 설정

#### TanStack Query

- [ ] Query Key Factory 패턴 사용
- [ ] 적절한 staleTime 설정
- [ ] 에러/로딩 상태 처리
- [ ] prefetch 활용 (서버 컴포넌트)

#### Prisma

- [ ] 트랜잭션 적절히 사용
- [ ] select로 필요한 필드만 조회
- [ ] 배치 작업 시 createMany/updateMany 활용
- [ ] 연결 풀 관리

### 4. 출력 형식

```markdown
## PR #번호 코드 리뷰 결과

### 🔴 CRITICAL (머지 전 반드시 수정)

| 이슈   | 파일:라인           | 설명      |
| ------ | ------------------- | --------- |
| 이슈명 | `파일경로:라인번호` | 상세 설명 |

### 🟡 WARNING (빠른 시일 내 수정 권장)

| 이슈   | 파일:라인           | 설명      |
| ------ | ------------------- | --------- |
| 이슈명 | `파일경로:라인번호` | 상세 설명 |

### 🟢 SUGGESTION (개선 권장)

| 이슈   | 설명      |
| ------ | --------- |
| 이슈명 | 상세 설명 |

### ✅ 잘된 점

- 긍정적인 피드백 1
- 긍정적인 피드백 2

### 권장 조치

**머지 전:**

1. 필수 수정 사항

**머지 후 (다음 PR):**

1. 권장 수정 사항
```

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js App Router Patterns](https://nextjs.org/docs/app)
- [TanStack Query Best Practices](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
