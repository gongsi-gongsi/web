# Commit Summary Skill

커밋 전 작업 내역을 분석하고 상세한 구현 문서를 생성합니다.

---

You are a commit summary expert. Your task is to analyze the current git changes and create a detailed implementation document.

## Steps to follow:

### 1. Check git status

- Run `git status --short` to see all changed files
- Run `git diff --cached` to see staged changes (if any)
- Run `git diff` to see unstaged changes

### 2. Analyze each changed file

- For each modified/added file, read the full content
- Understand what was changed and why
- Identify the purpose of the changes

### 3. Create a detailed document

Create a markdown file named `COMMIT_SUMMARY.md` in the project root with the following structure:

````markdown
# 작업 내역 요약

## 📋 작업 개요

[전체 작업에 대한 간단한 설명]

## 📁 변경된 파일 목록

각 파일에 한 줄 설명을 포함하여, 파일만 봐도 무엇이 바뀌었는지 알 수 있도록 합니다.

### 새로 추가된 파일

| 파일                | 설명                             |
| ------------------- | -------------------------------- |
| `path/to/file1.ts`  | [이 파일이 하는 역할 한 줄 설명] |
| `path/to/file2.tsx` | [이 파일이 하는 역할 한 줄 설명] |

### 수정된 파일

| 파일                | 변경 내용                                  |
| ------------------- | ------------------------------------------ |
| `path/to/file3.ts`  | [이 파일에서 무엇이 바뀌었는지 한 줄 설명] |
| `path/to/file4.tsx` | [이 파일에서 무엇이 바뀌었는지 한 줄 설명] |

### 삭제된 파일

| 파일               | 삭제 이유                  |
| ------------------ | -------------------------- |
| `path/to/file5.ts` | [왜 삭제했는지 한 줄 설명] |

## 🔧 상세 구현 내역

### 1. [기능/모듈 이름]

#### 📄 관련 파일

- `path/to/file1.ts`
- `path/to/file2.tsx`

#### 💡 구현 내용

[무엇을 구현했는지 자세히 설명]

#### 🎯 구현 이유

[왜 이렇게 구현했는지 설명]

- 기술적 이유
- 비즈니스 요구사항
- 아키텍처 고려사항

#### 📝 주요 변경 사항

- 변경 1: [설명]
- 변경 2: [설명]
- 변경 3: [설명]

#### 🔍 코드 예시

```typescript
// 주요 변경 부분의 코드 스니펫
```
````

---

### 2. [다음 기능/모듈 이름]

[위와 동일한 구조 반복]

## 🎨 UI/UX 변경사항

[UI 관련 변경이 있다면 설명]

## 🐛 버그 수정

[버그 수정이 있다면 설명]

## 🔄 리팩토링

[리팩토링이 있다면 설명]

## 📚 기타 참고사항

[추가로 알아야 할 내용]

## ✅ 테스트 결과

[테스트 결과나 확인 사항]

```

### 4. Ordering: 코드를 읽기 좋은 순서로 정리

상세 구현 내역과 파일 목록은 **코드를 처음 읽는 사람이 파악하기 쉬운 순서**로 정렬합니다. 파일이 변경된 시간순이나 알파벳순이 아니라, 의존 관계와 이해 흐름을 따릅니다.

**정렬 원칙 (우선순위 순):**

1. **타입/인터페이스 정의** → 데이터 구조를 먼저 알아야 나머지를 이해할 수 있음
2. **하위 레이어 (shared, entities의 lib/model)** → 기반 유틸리티, 도메인 로직
3. **API 레이어 (route, api client)** → 데이터가 어떻게 흐르는지
4. **훅/상태 관리** → 데이터를 어떻게 소비하는지
5. **UI 컴포넌트 (widgets, features)** → 최종적으로 화면에 어떻게 보이는지
6. **페이지/라우트 진입점 (app/)** → 전체를 조합하는 곳

즉, **의존되는 쪽 → 의존하는 쪽** 순서로 bottom-up으로 정리합니다. 이렇게 하면 읽는 사람이 위에서부터 순서대로 읽으면서 자연스럽게 전체 구조를 파악할 수 있습니다.

### 5. Important guidelines
- Write in Korean
- Be detailed and specific
- Explain WHY, not just WHAT
- Include code snippets for important changes
- Group related changes together
- Focus on the intent and reasoning behind changes
- Don't just list changes - explain their purpose and impact

### 5. After creating the document
- Inform the user that `COMMIT_SUMMARY.md` has been created
- Suggest reviewing it before committing
- Ask if they want to make any adjustments

## Goal

The goal is to create documentation that helps team members (or future you) understand not just what changed, but WHY it changed and what problem it solves.
```
