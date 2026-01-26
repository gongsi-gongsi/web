/**
 * 공공데이터포털 API 테스트 스크립트
 * 실행: pnpm --filter web tsx scripts/test-public-data-api.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { getKrxStockItems, getStockPriceItems } from '../shared/lib/public-data'

async function testStockListApi() {
  console.log('=== KRX 상장종목정보 API 테스트 ===')

  try {
    const items = await getKrxStockItems({ numOfRows: 5 })
    console.log(`조회된 종목 수: ${items.length}`)
    console.log('샘플 데이터:')
    items.forEach(item => {
      console.log(`  - ${item.itmsNm} (${item.srtnCd}) - ${item.mrktCtg}`)
    })
    return true
  } catch (error) {
    console.error('API 호출 실패:', error)
    return false
  }
}

async function testStockPriceApi() {
  console.log('\n=== 주식시세정보 API 테스트 ===')

  try {
    const items = await getStockPriceItems({ numOfRows: 5 })
    console.log(`조회된 시세 수: ${items.length}`)
    console.log('샘플 데이터:')
    items.forEach(item => {
      console.log(
        `  - ${item.itmsNm} (${item.srtnCd}): 종가 ${Number(item.clpr).toLocaleString()}원, 거래량 ${Number(item.trqu).toLocaleString()}`
      )
    })
    return true
  } catch (error) {
    console.error('API 호출 실패:', error)
    return false
  }
}

async function main() {
  console.log('공공데이터포털 API 테스트 시작\n')

  const stockListResult = await testStockListApi()
  const stockPriceResult = await testStockPriceApi()

  console.log('\n=== 테스트 결과 ===')
  console.log(`KRX 상장종목정보 API: ${stockListResult ? '✅ 성공' : '❌ 실패'}`)
  console.log(`주식시세정보 API: ${stockPriceResult ? '✅ 성공' : '❌ 실패'}`)

  process.exit(stockListResult && stockPriceResult ? 0 : 1)
}

main()
