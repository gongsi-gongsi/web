import { NextResponse } from 'next/server'
import { getAdminUser } from '@/shared/lib/admin-auth'

export async function GET() {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(adminUser)
}
