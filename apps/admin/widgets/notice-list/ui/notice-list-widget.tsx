'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from '@gs/ui'
import { PencilSimple, Trash, PushPin } from '@phosphor-icons/react'
import {
  useNotices,
  useDeleteNotice,
  NOTICE_CATEGORY_LABELS,
  type Notice,
  type NoticeCategory,
} from '@/entities/notice'

const CATEGORY_FILTERS: { value: string; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'NOTICE', label: '공지' },
  { value: 'UPDATE', label: '업데이트' },
  { value: 'EVENT', label: '이벤트' },
  { value: 'MAINTENANCE', label: '점검' },
]

export function NoticeListWidget() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')

  const { data, isLoading } = useNotices({ page, category: category || undefined })
  const deleteMutation = useDeleteNotice()
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null)

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        {CATEGORY_FILTERS.map(filter => (
          <Button
            key={filter.value}
            variant={category === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCategory(filter.value)
              setPage(1)
            }}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="py-12 text-center text-muted-foreground">공지사항이 없습니다</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">카테고리</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-24">작성자</TableHead>
                <TableHead className="w-24">상태</TableHead>
                <TableHead className="w-32">작성일</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map(notice => (
                <TableRow key={notice.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {NOTICE_CATEGORY_LABELS[notice.category as NoticeCategory]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {notice.isPinned && (
                        <PushPin size={14} weight="fill" className="text-primary" />
                      )}
                      {notice.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{notice.author.name}</TableCell>
                  <TableCell>
                    <Badge variant={notice.isPublished ? 'default' : 'secondary'}>
                      {notice.isPublished ? '발행' : '임시저장'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/notices/${notice.id}/edit`}>
                          <PencilSimple size={16} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(notice)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data.pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
