/**
 * DART 고유번호 조회 API
 * 전체 상장/비상장 기업의 고유번호, 종목코드, 기업명 정보 제공
 */

import AdmZip from 'adm-zip'
import { parseStringPromise } from 'xml2js'
import { downloadZipFile } from '../client'
import type { CorpCode, CorpCodeResponse } from '../types'

/**
 * 고유번호 전체 목록 조회
 * ZIP 파일을 다운로드하여 XML을 파싱하고 기업 목록을 반환
 *
 * @returns 전체 기업 고유번호 목록
 */
export async function getCorpCodeList(): Promise<CorpCode[]> {
  try {
    // 1. ZIP 파일 다운로드
    const zipBuffer = await downloadZipFile('corpCode.xml')

    // 2. ZIP 압축 해제
    const zip = new AdmZip(zipBuffer)
    const zipEntries = zip.getEntries()

    if (zipEntries.length === 0) {
      throw new Error('ZIP 파일에 데이터가 없습니다.')
    }

    // 첫 번째 파일(CORPCODE.xml) 추출
    const xmlData = zipEntries[0].getData().toString('utf8')

    // 3. XML 파싱
    const parsed = await parseStringPromise(xmlData, {
      explicitArray: true,
      trim: true,
    })

    const result = parsed as CorpCodeResponse

    if (!result.result?.list) {
      throw new Error('XML 파싱 결과가 올바르지 않습니다.')
    }

    // 4. 데이터 변환
    const corpCodes: CorpCode[] = result.result.list.map(item => {
      const stockCode = item.stock_code?.[0]?.trim()

      return {
        corpCode: item.corp_code[0],
        corpName: item.corp_name[0],
        stockCode: stockCode && stockCode !== ' ' ? stockCode : undefined,
        modifyDate: item.modify_date[0],
      }
    })

    return corpCodes
  } catch (error) {
    console.error('고유번호 조회 실패:', error)
    throw new Error(
      `DART 고유번호 조회 API 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    )
  }
}

/**
 * 상장 기업만 필터링
 */
export function filterListedCompanies(corpCodes: CorpCode[]): CorpCode[] {
  return corpCodes.filter(corp => corp.stockCode !== undefined)
}
