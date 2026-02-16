---
name: team-review
description: 코드 리뷰용 에이전트 팀(lead+security-reviewer+architecture-reviewer)을 자동 구성하여 보안/아키텍처 병렬 리뷰 후 종합 보고서를 생성합니다.
---

# Code Review Team 스킬

`/team-review <리뷰 대상>` — 코드 리뷰를 위한 에이전트 팀을 구성합니다. 보안과 아키텍처를 병렬 리뷰하여 종합 보고서를 생성합니다.

리뷰 대상: PR 번호(`#42`), 브랜치명(`feature/xxx`), 파일/디렉토리 경로

## 팀 구성

| 역할                  | model  | subagent_type   | 담당                        |
| --------------------- | ------ | --------------- | --------------------------- |
| team-lead             | opus   | general-purpose | 리뷰 조율, 종합 보고서 작성 |
| security-reviewer     | sonnet | general-purpose | 보안 취약점 리뷰            |
| architecture-reviewer | sonnet | Explore         | FSD 아키텍처 준수 확인      |

## 실행 절차

`$ARGUMENTS`에서 리뷰 대상을 파싱하여 아래를 수행합니다.

### 1. 팀/태스크 생성

```
TeamCreate: team_name="review-team", description="코드 리뷰: $ARGUMENTS"
```

태스크 3개 생성:

1. 보안 리뷰
2. 아키텍처 리뷰
3. 종합 보고서 작성 (← 1, 2 둘 다에 blockedBy)

### 2. Phase 1 — 변경사항 수집 (team-lead)

- PR: `gh pr diff <번호>`
- 브랜치: `git diff develop...<브랜치명>`
- 경로: 해당 파일 목록 수집

### 3. Phase 2 — 병렬 리뷰 (두 리뷰어 **동시** 스폰)

⚠️ 반드시 같은 메시지에서 두 Task를 동시 호출하여 병렬 실행합니다.

```
Task:
  name: "security-reviewer", subagent_type: "general-purpose", model: "sonnet", team_name: "review-team"
  prompt: |
    review-team의 security-reviewer. "$ARGUMENTS" 보안 리뷰:
    대상 파일: [team-lead 수집 목록]
    체크: 입력 검증(Zod, SQL인젝션, XSS), 인증/인가, 데이터 노출(환경변수/시크릿),
    API 보안(rate limit, CORS), 의존성 취약점.
    심각도 분류: 🔴 CRITICAL / 🟡 WARNING / 🟢 INFO
    결과를 team-lead에게 전송.
```

```
Task:
  name: "architecture-reviewer", subagent_type: "Explore", model: "sonnet", team_name: "review-team"
  prompt: |
    review-team의 architecture-reviewer. "$ARGUMENTS" 아키텍처 리뷰:
    대상 파일: [team-lead 수집 목록]
    체크: FSD 레이어 규칙(app/ 내 ui 금지, 상→하 import만), 모듈 구조(barrel export, kebab-case),
    코딩 규칙(function 컴포넌트, interface Props, @gs/ui), Next.js 패턴, TanStack Query, TypeScript.
    심각도 분류: 🔴 CRITICAL / 🟡 WARNING / 🟢 SUGGESTION
    결과를 team-lead에게 전송.
```

### 4. Phase 3 — 종합 보고서 (team-lead)

양쪽 결과를 종합하여 출력:

```markdown
## 코드 리뷰 결과: $ARGUMENTS

### 🔴 CRITICAL

| 유형 | 이슈 | 파일:라인 | 설명 |

### 🟡 WARNING

| 유형 | 이슈 | 파일:라인 | 설명 |

### 🟢 SUGGESTION/INFO

| 유형 | 이슈 | 설명 |

### ✅ 잘된 점

### 권장 조치 (즉시 / 다음 PR)
```

### 5. 정리

```
SendMessage(type: "shutdown_request") → security-reviewer, architecture-reviewer
TeamDelete
```
