/**
 * Google Gemini API 클라이언트
 * @module shared/lib/gemini
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_MODEL = 'gemini-2.5-flash-lite'

/**
 * Gemini API를 호출하여 텍스트를 생성합니다
 * @param prompt - 프롬프트 문자열
 * @returns 생성된 텍스트
 * @throws {Error} API 키가 없거나 호출 실패 시
 */
export async function generateContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다')
  }

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error')
    throw new Error(`Gemini API error: ${response.status} - ${errorBody}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Gemini API: 응답에서 텍스트를 추출할 수 없습니다')
  }

  return text
}
