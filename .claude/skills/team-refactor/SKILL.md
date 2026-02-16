---
name: team-refactor
description: 리팩토링용 에이전트 팀(lead+analyzer+implementer 2명)을 자동 구성하여 영향분석→전략수립→병렬구현→통합검증 워크플로우를 실행합니다.
---

# Refactor Team 스킬

`/team-refactor <리팩토링 대상 및 목표>` — 리팩토링을 위한 에이전트 팀을 구성합니다. 2명의 병렬 구현자로 대규모 리팩토링을 효율적으로 처리합니다.

## 팀 구성

| 역할          | model  | subagent_type   | 담당                            |
| ------------- | ------ | --------------- | ------------------------------- |
| team-lead     | opus   | general-purpose | 전략 수립, 작업 분할, 충돌 해결 |
| analyzer      | sonnet | Explore         | 영향 범위 분석, 의존성 추적     |
| implementer-1 | sonnet | general-purpose | 리팩토링 파트 1                 |
| implementer-2 | sonnet | general-purpose | 리팩토링 파트 2                 |

## 실행 절차

`$ARGUMENTS`에서 리팩토링 설명을 파싱하여 아래를 수행합니다.

### 1. 팀/태스크 생성

```
TeamCreate: team_name="refactor-team", description="리팩토링: $ARGUMENTS"
```

태스크 5개 생성 (의존성):

1. 영향 범위 분석
2. 리팩토링 전략 수립 (← 1에 blockedBy)
3. 구현 파트 1 (← 2에 blockedBy)
4. 구현 파트 2 (← 2에 blockedBy)
5. 통합 검증 (← 3, 4 둘 다에 blockedBy)

### 2. Phase 1 — 분석 (analyzer 스폰)

```
Task:
  name: "analyzer", subagent_type: "Explore", model: "sonnet", team_name: "refactor-team"
  prompt: |
    refactor-team의 analyzer. "$ARGUMENTS" 리팩토링 영향 범위 분석:
    1. 대상 파일/모듈 식별
    2. 의존성 그래프 (대상을 import하는 파일)
    3. 역의존성 (대상이 import하는 파일)
    4. FSD 레이어 간 의존 관계
    5. 함께 리팩토링할 유사 코드
    6. 변경 시 깨질 수 있는 리스크 포인트
    파일 목록과 의존성 관계를 team-lead에게 전송.
```

### 3. Phase 2 — 전략 수립 (team-lead 직접)

analyzer 결과를 받아 작업을 2개 파트로 분할:

- **분할 원칙**: 같은 파일을 두 구현자가 동시 수정하지 않도록 (레이어별 또는 도메인별)
- 각 파트의 작업 목록, 파트 간 인터페이스 계약(타입/export)
- 사용자에게 전략 출력

### 4. Phase 3 — 병렬 구현 (implementer-1, implementer-2 **동시** 스폰)

⚠️ 반드시 같은 메시지에서 두 Task를 동시 호출하여 병렬 실행합니다.

```
Task:
  name: "implementer-1", subagent_type: "general-purpose", model: "sonnet", team_name: "refactor-team"
  prompt: |
    refactor-team의 implementer-1. "$ARGUMENTS" 리팩토링 파트 1.
    담당: [파트 1 작업 목록]
    인터페이스 계약: [파트 2와 공유 규약]
    CLAUDE.md 코딩 규칙 준수. 완료 후 team-lead에게 전송.
```

```
Task:
  name: "implementer-2", subagent_type: "general-purpose", model: "sonnet", team_name: "refactor-team"
  prompt: |
    refactor-team의 implementer-2. "$ARGUMENTS" 리팩토링 파트 2.
    담당: [파트 2 작업 목록]
    인터페이스 계약: [파트 1과 공유 규약]
    CLAUDE.md 코딩 규칙 준수. 완료 후 team-lead에게 전송.
```

### 5. Phase 4 — 통합 검증 및 정리

team-lead가 검증(파일 충돌, import/export 일관성, 타입 호환, FSD 규칙) 후 사용자에게 보고:

- 전후 구조 비교, 변경 파일(파트별), 후속 제안

```
SendMessage(type: "shutdown_request") → analyzer, implementer-1, implementer-2
TeamDelete
```
