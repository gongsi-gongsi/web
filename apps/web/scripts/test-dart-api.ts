/**
 * DART API 연동 테스트 스크립트
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { getCorpCodeList, filterListedCompanies } from '../shared/lib/dart'

// .env.local 로드
config({ path: resolve(__dirname, '../.env.local'), override: true })

async function testDartApi() {
  console.log('🔌 DART API 연동 테스트 시작...\n')

  try {
    // 1. API 키 확인
    if (!process.env.DART_API_KEY) {
      console.error('❌ DART_API_KEY가 설정되지 않았습니다.')
      console.log('\n📝 .env.local에 다음을 추가하세요:')
      console.log('DART_API_KEY="YOUR_API_KEY"')
      console.log('\nAPI 키 발급: https://opendart.fss.or.kr')
      process.exit(1)
    }

    console.log('✓ DART_API_KEY 로드됨\n')

    // 2. 고유번호 전체 목록 조회
    console.log('📥 고유번호 목록 다운로드 중...')
    const allCorpCodes = await getCorpCodeList()
    console.log(`✅ 전체 기업 수: ${allCorpCodes.length}개\n`)

    // 3. 상장 기업만 필터링
    const listedCorps = filterListedCompanies(allCorpCodes)
    console.log(`📊 상장 기업 수: ${listedCorps.length}개`)
    console.log(`📋 비상장 기업 수: ${allCorpCodes.length - listedCorps.length}개\n`)

    // 4. 샘플 데이터 출력
    console.log('📌 상장 기업 샘플 (처음 5개):')
    console.log('='.repeat(80))
    listedCorps.slice(0, 5).forEach(corp => {
      console.log(
        `${corp.corpName.padEnd(20)} | 종목코드: ${corp.stockCode} | 고유번호: ${corp.corpCode}`
      )
    })
    console.log('='.repeat(80))

    // 5. 특정 기업 검색 테스트
    const testCompanies = ['삼성전자', 'SK하이닉스', '카카오', 'NAVER']
    console.log('\n🔍 주요 기업 검색 테스트:')
    console.log('='.repeat(80))
    testCompanies.forEach(name => {
      const found = listedCorps.find(corp => corp.corpName.includes(name))
      if (found) {
        console.log(
          `✅ ${found.corpName.padEnd(20)} | 종목: ${found.stockCode} | 고유번호: ${found.corpCode}`
        )
      } else {
        console.log(`❌ ${name} - 찾을 수 없음`)
      }
    })
    console.log('='.repeat(80))

    console.log('\n✨ DART API 테스트 완료!\n')
  } catch (error) {
    console.error('\n❌ DART API 테스트 실패:', error)
    if (error instanceof Error) {
      console.error('상세 오류:', error.message)
    }
    process.exit(1)
  }
}

testDartApi()
