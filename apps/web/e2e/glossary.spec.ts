import { test, expect } from '@playwright/test'

// 용어집은 정적 데이터 기반이라 API 모킹 없이 테스트 가능합니다
// 주의: GlossaryPage는 데스크톱/모바일 두 섹션을 DOM에 동시 렌더링합니다.
// getByText()는 숨겨진 섹션의 요소도 찾으므로 getByRole()이나 :visible 의사 클래스를 사용합니다.

test.describe('용어집 - 공통', () => {
  test('페이지가 로드되고 용어 목록이 표시된다', async ({ page }) => {
    await page.goto('/glossary')

    await expect(page.getByRole('heading', { name: '투자 용어집' })).toBeVisible()
    // getByRole은 ARIA 트리만 탐색하므로 숨겨진 섹션의 버튼은 자동 제외됨
    await expect(page.getByRole('button', { name: /^PER/ }).first()).toBeVisible()
  })

  test('검색으로 용어를 필터링할 수 있다', async ({ page }) => {
    await page.goto('/glossary')

    // :visible 의사 클래스로 보이는 input만 대상으로 함
    await page.locator('input:visible[placeholder*="용어를 검색하세요"]').fill('PER')

    // :visible로 보이는 p 요소만 매칭
    await expect(page.locator('p:visible').filter({ hasText: /검색 결과/ })).toBeVisible()
  })

  test('카테고리 필터가 동작한다', async ({ page }) => {
    await page.goto('/glossary')

    // Badge는 <span>이므로 getByRole('button')이 아닌 :visible span으로 클릭
    await page.locator('span:visible').filter({ hasText: '재무제표' }).first().click()

    await expect(page.locator('p:visible').filter({ hasText: /검색 결과/ })).toBeVisible()
  })

  test('검색어 초기화(X) 버튼이 동작한다', async ({ page }) => {
    await page.goto('/glossary')

    const searchInput = page.locator('input:visible[placeholder*="용어를 검색하세요"]')
    await searchInput.fill('PER')
    await expect(page.locator('p:visible').filter({ hasText: /검색 결과/ })).toBeVisible()

    // getByRole('button')은 ARIA 트리만 참조하므로 숨겨진 X 버튼은 제외됨
    await page
      .getByRole('button')
      .filter({ has: page.locator('svg') })
      .first()
      .click()

    await expect(searchInput).toHaveValue('')
    await expect(page.locator('p:visible').filter({ hasText: /총.*개의 용어/ })).toBeVisible()
  })
})

test.describe('용어집 - 데스크톱', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('용어 클릭 시 우측 패널에 상세 내용이 표시된다', async ({ page }) => {
    await page.goto('/glossary')

    // getByRole은 ARIA 트리만 탐색 → 숨겨진 모바일 섹션 버튼 제외
    await page.getByRole('button', { name: /PBR/ }).first().click()

    // 패널 제목 h2가 'PBR'로 변경됨
    await expect(page.getByRole('heading', { name: 'PBR', level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: '설명' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '쉬운 예시' })).toBeVisible()
  })

  test('관련 용어 배지 클릭 시 해당 용어로 이동한다', async ({ page }) => {
    await page.goto('/glossary')

    // PER 클릭 → PER 패널 표시
    await page.getByRole('button', { name: /^PER/ }).first().click()
    await expect(page.getByRole('heading', { name: 'PER', level: 2 })).toBeVisible()

    // 패널의 관련 용어 섹션 대기
    await page.getByRole('heading', { name: '관련 용어' }).waitFor()

    // <main> 영역(패널)의 PBR 버튼 클릭 (사이드바가 아닌 패널 내 관련 용어)
    await page.locator('main').getByRole('button', { name: /PBR/ }).first().click()

    await expect(page.getByRole('heading', { name: 'PBR', level: 2 })).toBeVisible()
  })
})

test.describe('용어집 - 모바일', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('용어 클릭 시 바텀 시트가 열린다', async ({ page }) => {
    await page.goto('/glossary')

    // 모바일 목록에서 첫 번째 용어 클릭 (getByRole은 ARIA 트리 기반)
    await page.getByRole('button', { name: /PER/ }).first().click()

    // 바텀 시트(dialog)가 열리고 모달 내부 콘텐츠 확인
    // '설명'은 모달 내부에만 있는 h4 (사이드바 목록에는 없음)
    await expect(page.getByRole('dialog').getByText('설명')).toBeVisible()
    await expect(page.getByRole('dialog').getByText('쉬운 예시')).toBeVisible()
  })

  test('바텀 시트 X 버튼으로 닫을 수 있다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: /PER/ }).first().click()
    await expect(page.getByRole('dialog').getByText('설명')).toBeVisible()

    // Sheet 내부 X 버튼 클릭 (sr-only "Close")
    await page.getByRole('button', { name: 'Close' }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('바텀 시트 바깥 영역 클릭 시 닫힌다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: /PER/ }).first().click()
    await expect(page.getByRole('dialog').getByText('설명')).toBeVisible()

    // 오버레이(시트 바깥) 클릭 - 화면 상단 영역
    await page.mouse.click(195, 100)

    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('Escape 키로 바텀 시트를 닫을 수 있다', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('button', { name: /PER/ }).first().click()
    await expect(page.getByRole('dialog').getByText('설명')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})
