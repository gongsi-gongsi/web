import AdmZip from 'adm-zip'
import { parse as parseHTML } from 'node-html-parser'

const MAX_TEXT_LENGTH = 30000
const HEAD_RATIO = 0.6

/**
 * DART 공시 ZIP 파일에서 텍스트를 추출합니다
 * ZIP 내 HTML/XML 문서를 파싱하여 본문 텍스트만 추출하고,
 * 앞부분(개요/사업내용) 60% + 뒷부분(재무제표/수치) 40%를 조합하여
 * Gemini 토큰 제한에 맞게 트리밍합니다
 * @param zipBuffer - DART document.xml API로 다운로드한 ZIP 버퍼
 * @returns 추출된 텍스트 (최대 약 30,000자)
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

  // 짧은 문서는 그대로 반환
  if (fullText.length <= MAX_TEXT_LENGTH) {
    return fullText
  }

  // 긴 문서: 앞부분(개요/사업내용) + 뒷부분(재무제표/수치) 조합
  return extractHeadAndTail(fullText, MAX_TEXT_LENGTH)
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
 * 텍스트의 앞부분과 뒷부분을 조합하여 추출합니다
 * 앞부분(개요, 사업내용)과 뒷부분(재무제표, 수치)을 모두 포함하여
 * AI가 전체 맥락을 파악할 수 있도록 합니다
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 앞+뒤 조합된 텍스트
 */
function extractHeadAndTail(text: string, maxLength: number): string {
  const headLength = Math.floor(maxLength * HEAD_RATIO)
  const tailLength = maxLength - headLength

  const head = trimAtSentence(text.substring(0, headLength))
  const tail = trimAtSentenceStart(text.substring(text.length - tailLength))

  return `${head}\n\n[... 중략 ...]\n\n${tail}`
}

/**
 * 텍스트를 문장 끝에서 자릅니다
 * @param text - 원본 텍스트
 * @returns 문장 단위로 잘린 텍스트
 */
function trimAtSentence(text: string): string {
  const lastEnd = Math.max(text.lastIndexOf('.'), text.lastIndexOf('。'), text.lastIndexOf('\n'))

  if (lastEnd > text.length * 0.8) {
    return text.substring(0, lastEnd + 1)
  }

  return text
}

/**
 * 텍스트를 문장 시작에서 자릅니다
 * @param text - 원본 텍스트
 * @returns 문장 시작부터의 텍스트
 */
function trimAtSentenceStart(text: string): string {
  const firstNewline = text.indexOf('\n')

  if (firstNewline > 0 && firstNewline < text.length * 0.2) {
    return text.substring(firstNewline + 1)
  }

  return text
}
