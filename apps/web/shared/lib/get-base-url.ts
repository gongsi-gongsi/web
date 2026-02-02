/**
 * 서버/클라이언트 환경에 따라 적절한 base URL을 반환합니다
 * - 클라이언트: window.location.origin
 * - 서버 (Vercel): VERCEL_URL 환경변수
 * - 서버 (로컬): NEXT_PUBLIC_APP_URL 또는 localhost:3000
 * @returns base URL 문자열
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}
