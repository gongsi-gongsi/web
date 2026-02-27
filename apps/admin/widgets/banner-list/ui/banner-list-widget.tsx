'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
import { DotsSixVertical, PencilSimple, Trash } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useBanners, useDeleteBanner, useReorderBanners, type Banner } from '@/entities/banner'
import { adminQueryKeys } from '@/shared/lib/query-keys'

interface SortableBannerRowProps {
  banner: Banner
  onDelete: (banner: Banner) => void
}

function SortableBannerRow({ banner, onDelete }: SortableBannerRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: banner.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isAlwaysOn = !banner.startDate && !banner.endDate

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <DotsSixVertical size={16} />
        </button>
      </TableCell>
      <TableCell>
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          width={80}
          height={45}
          className="rounded border border-border object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">{banner.title}</TableCell>
      <TableCell>
        <Badge variant={banner.isActive ? 'default' : 'secondary'}>
          {banner.isActive ? '활성' : '비활성'}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {isAlwaysOn ? (
          <Badge variant="outline">상시</Badge>
        ) : (
          <>
            {banner.startDate
              ? new Date(banner.startDate).toLocaleDateString('ko-KR')
              : '시작일 없음'}
            {' ~ '}
            {banner.endDate ? new Date(banner.endDate).toLocaleDateString('ko-KR') : '종료일 없음'}
          </>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/banners/${banner.id}/edit`}>
              <PencilSimple size={16} />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(banner)}
            className="text-destructive hover:text-destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function BannerListWidget() {
  const { data: banners, isLoading } = useBanners()
  const deleteMutation = useDeleteBanner()
  const reorderMutation = useReorderBanners()
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)

  const queryClient = useQueryClient()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      alert('배너 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !banners) return

    const oldIndex = banners.findIndex(b => b.id === active.id)
    const newIndex = banners.findIndex(b => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newBanners = [...banners]
    const [moved] = newBanners.splice(oldIndex, 1)
    newBanners.splice(newIndex, 0, moved)

    queryClient.setQueryData(adminQueryKeys.banners.all, newBanners)

    try {
      await reorderMutation.mutateAsync(newBanners.map(b => b.id))
    } catch {
      queryClient.setQueryData(adminQueryKeys.banners.all, banners)
      alert('순서 변경에 실패했습니다. 다시 시도해주세요.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!banners?.length) {
    return <div className="py-12 text-center text-muted-foreground">등록된 배너가 없습니다</div>
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">순서</TableHead>
                <TableHead className="w-24">이미지</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-24">상태</TableHead>
                <TableHead className="w-40">기간</TableHead>
                <TableHead className="w-32">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map(banner => (
                <SortableBannerRow key={banner.id} banner={banner} onDelete={setDeleteTarget} />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>배너 삭제</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; 배너를 삭제하시겠습니까? 이 작업은 되돌릴 수
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
