/**
 * AI 공시 요약을 위한 Gemini 프롬프트를 빌드합니다
 * @param companyName - 기업명
 * @param reportName - 공시 제목
 * @param disclosureType - 공시 유형 코드
 * @param documentText - 공시 원문 텍스트
 * @returns Gemini API에 전달할 프롬프트 문자열
 */
export function buildDisclosureSummaryPrompt(
  companyName: string,
  reportName: string,
  disclosureType: string | undefined,
  documentText: string
): string {
  const typeLabel = disclosureType ? getDisclosureTypeLabel(disclosureType) : '공시'
  const safeName = sanitizePromptInput(companyName)
  const safeReport = sanitizePromptInput(reportName)

  return `당신은 한국 주식 시장 전문 애널리스트입니다.
공시 원문을 읽고 개인 투자자가 빠르게 이해할 수 있도록 요약합니다.

## 입력 정보
- 기업명: ${safeName}
- 공시 제목: ${safeReport}
- 공시 유형: ${typeLabel}

## 공시 원문
${documentText}

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

{
  "summary": "핵심 요약 3~5문장. 개인 투자자가 이해하기 쉽게 작성",
  "sentiment": "positive 또는 negative 또는 neutral",
  "sentimentReason": "감성 판단 근거 1문장",
  "keyFigures": [
    { "label": "항목명", "value": "수치", "change": "전기 대비 변화율 (있는 경우)" }
  ]
}

## 규칙
- 전문 용어는 쉬운 표현으로 풀어서 설명
- 수치는 원 단위를 조/억 단위로 변환
- 투자 추천이나 매수/매도 의견은 절대 제시하지 않음
- 객관적 사실 위주로 서술
- keyFigures는 공시에서 추출한 주요 수치 (매출, 이익 등) 최대 5개
- 수치가 없는 공시의 경우 keyFigures는 빈 배열로 반환`
}

/**
 * 프롬프트 인젝션 방지를 위해 사용자 입력을 정제합니다
 * @param input - 사용자 입력 문자열
 * @returns 정제된 문자열
 */
function sanitizePromptInput(input: string): string {
  return input
    .replace(/[\n\r]/g, ' ')
    .replace(/^#+\s*/gm, '')
    .trim()
    .substring(0, 200)
}

/**
 * 공시 유형 코드를 한글 라벨로 변환합니다
 * @param type - 공시 유형 코드
 * @returns 한글 라벨
 */
function getDisclosureTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    A: '정기공시',
    B: '주요사항보고',
    C: '발행공시',
    D: '지분공시',
    E: '기타공시',
    F: '외부감사관련',
    G: '펀드공시',
    H: '자산유동화',
    I: '거래소공시',
    J: '공정위공시',
  }
  return labels[type] || '공시'
}
