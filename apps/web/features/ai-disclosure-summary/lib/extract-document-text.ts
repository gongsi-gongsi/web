import AdmZip from 'adm-zip'
import { parse as parseHTML } from 'node-html-parser'

const MAX_TEXT_LENGTH = 8000

/**
 * DART 공시 ZIP 파일에서 텍스트를 추출합니다
 * ZIP 내 HTML/XML 문서를 파싱하여 본문 텍스트만 추출하고,
 * Gemini 토큰 제한에 맞게 트리밍합니다
 * @param zipBuffer - DART document.xml API로 다운로드한 ZIP 버퍼
 * @returns 추출된 텍스트 (최대 약 8,000자)
 * @throws {Error} ZIP이 비어있거나 텍스트 추출 실패 시
 */
export function extractDocumentText(zipBuffer: Buffer): string {
  const zip = new AdmZip(zipBuffer)
  const entries = zip.getEntries()

  if (entries.length === 0) {
    throw new Error('ZIP 파일에 문서가 없습니다')
  }

  // 모든 문서의 텍스트를 합침
  const texts: string[] = []

  for (const entry of entries) {
    const content = entry.getData().toString('utf8')
    const text = extractTextFromHtml(content)
    if (text) {
      texts.push(text)
    }
  }

  const fullText = texts.join('\n\n')

  if (!fullText.trim()) {
    throw new Error('요약할 내용이 충분하지 않습니다')
  }

  // 토큰 제한에 맞게 트리밍
  return trimText(fullText, MAX_TEXT_LENGTH)
}

/**
 * HTML 문자열에서 본문 텍스트만 추출합니다
 * @param html - HTML 문자열
 * @returns 정제된 텍스트
 */
function extractTextFromHtml(html: string): string {
  const root = parseHTML(html)

  // script, style 태그 제거
  root.querySelectorAll('script, style').forEach(el => el.remove())

  // 텍스트 추출 및 정제
  let text = root.text

  // 연속 공백 및 빈 줄 정리
  text = text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()

  return text
}

/**
 * 텍스트를 지정된 최대 길이로 트리밍합니다
 * 문장 단위로 자르기를 시도합니다
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 트리밍된 텍스트
 */
function trimText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  // 최대 길이 근처의 문장 끝에서 자르기
  const truncated = text.substring(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('\n')
  )

  if (lastSentenceEnd > maxLength * 0.8) {
    return truncated.substring(0, lastSentenceEnd + 1)
  }

  return truncated
}
