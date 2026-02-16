---
name: team-feature
description: 기능 개발용 에이전트 팀(lead+researcher+implementer)을 자동 구성하여 FSD 아키텍처 기반으로 탐색→계획→구현→검증 워크플로우를 실행합니다.
---

# Feature Team 스킬

`/team-feature <기능 설명>` — 기능 개발을 위한 에이전트 팀을 구성하고 실행합니다.

## 팀 구성

| 역할        | model  | subagent_type   | 담당                         |
| ----------- | ------ | --------------- | ---------------------------- |
| team-lead   | opus   | general-purpose | 전체 조율, 태스크 분배, 검증 |
| researcher  | sonnet | Explore         | 코드베이스 탐색, 패턴 분석   |
| implementer | sonnet | general-purpose | 코드 구현                    |

## 실행 절차

`$ARGUMENTS`에서 기능 설명을 파싱하여 아래를 수행합니다.

### 1. 팀/태스크 생성

```
TeamCreate: team_name="feature-team", description="기능 개발: $ARGUMENTS"
```

태스크 4개 생성 (의존성 순서):

1. 코드베이스 탐색
2. 구현 계획 수립 (← 1에 blockedBy)
3. 코드 구현 (← 2에 blockedBy)
4. 통합 검증 (← 3에 blockedBy)

### 2. Phase 1 — 탐색 (researcher 스폰)

```
Task:
  name: "researcher", subagent_type: "Explore", model: "sonnet", team_name: "feature-team"
  prompt: |
    feature-team의 researcher. "$ARGUMENTS" 기능 구현을 위해 조사:
    1. 관련 기존 코드와 패턴 (유사 기능 구현 방식)
    2. FSD 레이어에서 이 기능의 위치
    3. 사용 가능한 기존 엔티티, 공유 모듈, @gs/ui 컴포넌트
    4. API 엔드포인트 구조 및 데이터 흐름
    결과를 team-lead에게 메시지로 전송.
```

### 3. Phase 2 — 계획 수립 (team-lead 직접)

researcher 결과를 받아 team-lead가 구현 계획 수립:

- 생성/수정할 파일 목록, FSD 레이어 배치, 구현 순서, 주의사항
- 사용자에게 계획 출력

### 4. Phase 3 — 구현 (implementer 스폰)

```
Task:
  name: "implementer", subagent_type: "general-purpose", model: "sonnet", team_name: "feature-team"
  prompt: |
    feature-team의 implementer. "$ARGUMENTS" 기능 구현.
    [team-lead 계획 포함]
    CLAUDE.md 코딩 규칙 준수: kebab-case, function 키워드, interface Props,
    barrel export(index.ts), @gs/ui import, app/ 안 ui/components 폴더 금지.
    완료 후 team-lead에게 결과 전송.
```

### 5. Phase 4 — 검증 및 정리

team-lead가 검증(FSD 규칙, 코딩 규칙, 타입 안전성, 일관성) 후 사용자에게 보고.

```
SendMessage(type: "shutdown_request") → researcher, implementer
TeamDelete
```
