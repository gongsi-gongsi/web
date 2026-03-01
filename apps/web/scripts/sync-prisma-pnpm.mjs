/**
 * prisma generate 후 pnpm store의 .prisma/client를 루트 생성본과 동기화합니다.
 * pnpm monorepo에서 @prisma/client가 pnpm store에 별도 캐시된 경우
 * prisma generate가 루트 node_modules/.prisma/client만 업데이트하므로
 * 이 스크립트로 pnpm store 경로도 함께 업데이트합니다.
 */
import { cpSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const webRoot = resolve(fileURLToPath(import.meta.url), '../../../../')
const pnpmDir = join(webRoot, 'node_modules/.pnpm')
const sourcePath = join(webRoot, 'node_modules/.prisma/client')

if (!existsSync(sourcePath)) {
  console.log('⚠️  Source .prisma/client not found, skipping sync')
  process.exit(0)
}

if (!existsSync(pnpmDir)) {
  console.log('⚠️  pnpm store not found, skipping sync')
  process.exit(0)
}

const entries = readdirSync(pnpmDir)
const prismaEntries = entries.filter(e => e.startsWith('@prisma+client'))

if (prismaEntries.length === 0) {
  console.log('⚠️  No @prisma+client entries in pnpm store')
  process.exit(0)
}

for (const entry of prismaEntries) {
  const destPath = join(pnpmDir, entry, 'node_modules/.prisma/client')
  if (existsSync(join(pnpmDir, entry, 'node_modules/.prisma'))) {
    console.log(`Syncing .prisma/client → ${entry}`)
    cpSync(sourcePath, destPath, { recursive: true, force: true })
  }
}

console.log('✅ Prisma client synced to pnpm store.')
