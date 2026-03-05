import { test, expect } from '@playwright/test'

// 주의: 공지사항 목록은 SSR(prefetchNotices)으로 서버에서 DB를 직접 조회합니다.
// page.route()는 브라우저 요청만 인터셉트하므로 SSR 요청에는 적용되지 않습니다.
// 초기 렌더링은 SSR 데이터를 사용하고, 카테고리 변경 시의 클라이언트 fetch만 모킹합니다.

// 실제 API 응답 형식: { data: [], pagination: { page, limit, total, totalPages } }
const EMPTY_NOTICES_RESPONSE = {
  data: [],
  pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
}

test.describe('공지사항', () => {
  test('공지사항 목록 페이지가 로드된다', async ({ page }) => {
    await page.goto('/notices')

    await expect(page.getByRole('heading', { name: '공지사항' })).toBeVisible()
  })

  test('카테고리 필터가 표시된다', async ({ page }) => {
    await page.goto('/notices')

    // 카테고리 필터 버튼은 NOTICE_CATEGORY_LABELS 상수에서 렌더링되므로 DB 무관하게 항상 표시됨
    await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
    await expect(page.getByRole('button', { name: '서비스' })).toBeVisible()
    await expect(page.getByRole('button', { name: '이벤트' })).toBeVisible()
    await expect(page.getByRole('button', { name: '점검' })).toBeVisible()
  })

  test('카테고리 필터를 클릭하면 활성 상태가 바뀐다', async ({ page }) => {
    // 카테고리 변경 시 발생하는 클라이언트 사이드 fetch를 모킹
    // (SSR 초기 렌더링은 서버에서 직접 DB 조회하므로 이 mock은 적용되지 않음)
    await page.route('**/api/notices**', route => {
      route.fulfill({ json: EMPTY_NOTICES_RESPONSE })
    })

    await page.goto('/notices')

    // 초기에는 '전체'가 활성 상태
    await expect(page.getByRole('button', { name: '전체' })).toHaveClass(/bg-primary/)

    // '서비스' 클릭 → 클라이언트 fetch(mock) → 컴포넌트 재렌더링 → '서비스' 활성화
    await page.getByRole('button', { name: '서비스' }).click()
    await expect(page.getByRole('button', { name: '서비스' })).toHaveClass(/bg-primary/)
    await expect(page.getByRole('button', { name: '전체' })).not.toHaveClass(/bg-primary/)
  })
})
