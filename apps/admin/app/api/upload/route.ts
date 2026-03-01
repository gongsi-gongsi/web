import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/shared/lib/admin-auth'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const [, errorRes] = await requireAdmin()
  if (errorRes) return errorRes

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: '파일이 필요합니다' }, { status: 400 })
  }

  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  const ext = extMap[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'JPG, PNG, WebP, GIF 파일만 업로드 가능합니다' },
      { status: 400 }
    )
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: '파일 크기는 5MB 이하만 가능합니다' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const filePath = `admin/${fileName}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabase.storage.from('images').upload(filePath, arrayBuffer, {
    contentType: file.type,
  })

  if (error) {
    return NextResponse.json({ error: '업로드에 실패했습니다' }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(filePath)

  return NextResponse.json({ url: publicUrl })
}
