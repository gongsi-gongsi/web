/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅합니다
 * @param date - 포맷팅할 날짜 (Date 객체 또는 날짜 문자열)
 * @returns 포맷팅된 날짜 문자열
 * @example
 * formatDate(new Date('2024-01-15')) // '2024.01.15'
 * formatDate('2024-01-15T09:00:00Z') // '2024.01.15'
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 날짜를 YYYY년 MM월 DD일 형식으로 포맷팅합니다
 * @param date - 포맷팅할 날짜 (Date 객체 또는 날짜 문자열)
 * @returns 포맷팅된 날짜 문자열
 * @example
 * formatDateKorean(new Date('2024-01-15')) // '2024년 01월 15일'
 * formatDateKorean('2024-01-15T09:00:00Z') // '2024년 01월 15일'
 */
export function formatDateKorean(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 오늘 날짜를 YYYY년 MM월 DD일 형식으로 반환합니다
 * @returns 오늘 날짜 문자열
 * @example
 * getTodayKorean() // '2024년 01월 15일'
 */
export function getTodayKorean(): string {
  return formatDateKorean(new Date())
}
