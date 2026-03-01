import type { NoticeCategory } from '../model/types'

export const NOTICE_CATEGORY_LABELS: Record<NoticeCategory, string> = {
  SERVICE: '서비스',
  EVENT: '이벤트',
  MAINTENANCE: '점검',
}

/** 카테고리별 배지 variant */
export const NOTICE_CATEGORY_BADGE_VARIANTS: Record<
  NoticeCategory,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  SERVICE: 'default',
  EVENT: 'outline',
  MAINTENANCE: 'destructive',
}

/** 카테고리별 액센트 컬러 (CSS variable) */
export const NOTICE_CATEGORY_ACCENT_COLOR: Record<NoticeCategory, string> = {
  SERVICE: 'var(--primary)',
  EVENT: 'var(--color-green-500, #22c55e)',
  MAINTENANCE: 'var(--destructive)',
}

/** 카테고리별 도트 컬러 클래스 */
export const NOTICE_CATEGORY_DOT_CLASS: Record<NoticeCategory, string> = {
  SERVICE: 'bg-primary',
  EVENT: 'bg-green-500',
  MAINTENANCE: 'bg-destructive',
}
