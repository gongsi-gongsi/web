---
name: team-fix
description: 버그 수정용 에이전트 팀(lead+investigator+fixer)을 자동 구성하여 원인조사→방향결정→수정→검증 워크플로우를 실행합니다.
---

# Bug Fix Team 스킬

`/team-fix <버그 설명>` — 버그 수정을 위한 에이전트 팀을 구성하고 실행합니다.

## 팀 구성

| 역할         | model  | subagent_type   | 담당                            |
| ------------ | ------ | --------------- | ------------------------------- |
| team-lead    | opus   | general-purpose | 조율, 원인 분석, 수정 방향 결정 |
| investigator | sonnet | Explore         | 버그 원인 추적, 관련 코드 탐색  |
| fixer        | sonnet | general-purpose | 버그 수정 구현                  |

## 실행 절차

`$ARGUMENTS`에서 버그 설명을 파싱하여 아래를 수행합니다.

### 1. 팀/태스크 생성

```
TeamCreate: team_name="fix-team", description="버그 수정: $ARGUMENTS"
```

태스크 4개 생성 (의존성 순서):

1. 버그 원인 조사
2. 수정 방향 결정 (← 1에 blockedBy)
3. 버그 수정 구현 (← 2에 blockedBy)
4. 수정 검증 (← 3에 blockedBy)

### 2. Phase 1 — 원인 조사 (investigator 스폰)

```
Task:
  name: "investigator", subagent_type: "Explore", model: "sonnet", team_name: "fix-team"
  prompt: |
    fix-team의 investigator. "$ARGUMENTS" 버그 원인 조사:
    1. 버그 관련 코드 파일 식별
    2. 데이터 흐름 추적 (API → 상태 → UI)
    3. 에러 발생 정확한 위치와 조건
    4. 관련 타입 정의 및 인터페이스
    5. 최근 변경 중 버그 유발 가능 코드
    근본 원인(root cause)을 특정하여 team-lead에게 전송.
```

### 3. Phase 2 — 수정 방향 결정 (team-lead 직접)

investigator 결과를 받아 team-lead가 수정 방향 결정:

- 근본 원인 확정, 수정 방법(최소 변경 원칙), 수정 파일 목록, 사이드 이펙트 검토
- 사용자에게 수정 방향 출력

### 4. Phase 3 — 수정 구현 (fixer 스폰)

```
Task:
  name: "fixer", subagent_type: "general-purpose", model: "sonnet", team_name: "fix-team"
  prompt: |
    fix-team의 fixer. "$ARGUMENTS" 버그 수정.
    근본 원인: [team-lead 분석 결과]
    수정 방향: [team-lead 결정 사항]
    주의: 최소 변경 원칙, 기존 동작 유지, CLAUDE.md 코딩 규칙 준수, 엣지 케이스 처리.
    완료 후 변경 파일과 내용을 team-lead에게 전송.
```

### 5. Phase 4 — 검증 및 정리

team-lead가 검증(버그 수정 확인, 사이드 이펙트, 코딩 규칙, 엣지 케이스) 후 사용자에게 보고:

- 근본 원인 요약, 수정 내용, 변경 파일 목록, 추가 확인 사항

```
SendMessage(type: "shutdown_request") → investigator, fixer
TeamDelete
```
