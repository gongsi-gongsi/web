/**
 * 관리자 계정 시드 스크립트
 *
 * 사용법:
 *   1. .env.local에 DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 설정
 *   2. npx tsx scripts/seed-admin.ts
 *
 * Supabase Auth에 관리자 계정을 생성하고, admin_users 테이블에 레코드를 추가합니다.
 */

import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// web 앱의 .env.local 로드
dotenv.config({ path: path.resolve(__dirname, '../../web/.env.local') })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gongsi.kr'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234!'
const ADMIN_NAME = process.env.ADMIN_NAME || '관리자'

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const databaseUrl = process.env.DATABASE_URL

  if (!supabaseUrl || !serviceRoleKey || !databaseUrl) {
    console.error('필수 환경변수가 설정되지 않았습니다.')
    console.error('NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL')
    process.exit(1)
  }

  // Supabase Admin 클라이언트
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Prisma 클라이언트
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    // 이미 존재하는지 확인
    const existing = await prisma.adminUser.findUnique({
      where: { email: ADMIN_EMAIL },
    })

    if (existing) {
      console.log(`관리자 ${ADMIN_EMAIL}은 이미 존재합니다.`)
      return
    }

    // Supabase Auth 계정 생성
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    })

    if (authError) {
      // 이미 Auth에 존재하는 경우 계속 진행
      if (!authError.message.includes('already been registered')) {
        throw authError
      }
      console.log(
        `Supabase Auth에 ${ADMIN_EMAIL}이 이미 존재합니다. admin_users 테이블만 추가합니다.`
      )
    }

    // admin_users 테이블에 추가
    const adminUser = await prisma.adminUser.create({
      data: {
        id: authUser?.user?.id ?? undefined,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin',
      },
    })

    console.log('관리자 계정이 생성되었습니다:')
    console.log(`  이메일: ${adminUser.email}`)
    console.log(`  이름: ${adminUser.name}`)
    console.log(`  ID: ${adminUser.id}`)
    console.log('  비밀번호: 환경변수 ADMIN_PASSWORD 또는 기본값 참조')
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(err => {
  console.error('시드 스크립트 실패:', err)
  process.exit(1)
})
