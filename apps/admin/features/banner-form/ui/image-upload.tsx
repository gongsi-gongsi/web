'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@gs/ui'
import { UploadSimple, X } from '@phosphor-icons/react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || '업로드 실패')
        return
      }

      const { url } = await res.json()
      onChange(url)
    } catch {
      alert('업로드에 실패했습니다')
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt={label}
            width={320}
            height={180}
            className="rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            <span className="flex items-center gap-2">
              <UploadSimple size={16} />
              {isUploading ? '업로드 중...' : '이미지 업로드'}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
