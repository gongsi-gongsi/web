module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 종류 제한
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 변경
        'style',    // 코드 포맷팅 (기능 변경 없음)
        'refactor', // 리팩토링
        'perf',     // 성능 개선
        'test',     // 테스트 추가/수정
        'build',    // 빌드 시스템, 외부 의존성 변경
        'ci',       // CI 설정 변경
        'chore',    // 기타 변경사항
        'revert',   // 이전 커밋 되돌리기
      ],
    ],
    // subject는 소문자로 시작
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    // subject 끝에 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
    // subject 최대 길이
    'subject-max-length': [2, 'always', 72],
    // body 한 줄 최대 길이
    'body-max-line-length': [2, 'always', 100],
  },
};
