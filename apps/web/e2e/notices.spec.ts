import { test, expect } from '@playwright/test'

// /api/notices 응답을 모킹하여 DB 없이 테스트합니다
const MOCK_NOTICES = {
  items: [
    {
      id: 'notice-1',
      title: '서비스 업데이트 안내',
      category: 'update',
      isPinned: true,
      createdAt: new Date('2025-01-01').toISOString(),
      updatedAt: new Date('2025-01-01').toISOString(),
    },
    {
      id: 'notice-2',
      title: '이벤트 공지',
      category: 'event',
      isPinned: false,
      createdAt: new Date('2025-01-02').toISOString(),
      updatedAt: new Date('2025-01-02').toISOString(),
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
}

const MOCK_NOTICE_DETAIL = {
  id: 'notice-1',
  title: '서비스 업데이트 안내',
  content: '서비스가 업데이트되었습니다. 새로운 기능을 확인해 보세요.',
  category: 'update',
  isPinned: true,
  createdAt: new Date('2025-01-01').toISOString(),
  updatedAt: new Date('2025-01-01').toISOString(),
}

test.describe('공지사항', () => {
  test.beforeEach(async ({ page }) => {
    // 공지사항 목록 API 모킹
    await page.route('**/api/notices**', route => {
      route.fulfill({ json: MOCK_NOTICES })
    })

    // 공지사항 상세 API 모킹
    await page.route('**/api/notices/notice-1', route => {
      route.fulfill({ json: MOCK_NOTICE_DETAIL })
    })
  })

  test('공지사항 목록 페이지가 로드된다', async ({ page }) => {
    await page.goto('/notices')

    await expect(page.getByRole('heading', { name: '공지사항' })).toBeVisible()
  })

  test('공지사항 목록이 표시된다', async ({ page }) => {
    await page.goto('/notices')

    await expect(page.getByText('서비스 업데이트 안내')).toBeVisible()
    await expect(page.getByText('이벤트 공지')).toBeVisible()
  })

  test('공지사항 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    await page.goto('/notices')

    await page.getByText('서비스 업데이트 안내').click()

    await expect(page).toHaveURL(/\/notices\/notice-1/)
  })
})
