'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from '@gs/ui'
import { useUser, useUserWatchlist, useDeleteUser } from '@/entities/user'

interface UserDetailWidgetProps {
  userId: string
}

export function UserDetailWidget({ userId }: UserDetailWidgetProps) {
  const router = useRouter()
  const { data: user, isLoading } = useUser(userId)
  const { data: watchlist, isLoading: watchlistLoading } = useUserWatchlist(userId)
  const deleteMutation = useDeleteUser()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  async function handleDelete() {
    await deleteMutation.mutateAsync(userId)
    router.push('/users')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full max-w-xl" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    return <div className="text-muted-foreground">유저를 찾을 수 없습니다</div>
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">유저 정보</h2>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
              유저 삭제
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">이메일</p>
              <p className="font-medium">{user.email || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">이름</p>
              <p className="font-medium">{user.name || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">가입일</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">텔레그램</p>
              <p className="font-medium">{user.telegramChatId || '연결안됨'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={user.notificationEmail ? 'default' : 'secondary'}>
                이메일 알림 {user.notificationEmail ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.notificationTelegram ? 'default' : 'secondary'}>
                텔레그램 알림 {user.notificationTelegram ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">
              관심종목: <strong>{user._count.watchlist}</strong>개
            </span>
            <span className="text-muted-foreground">
              AI 리포트: <strong>{user._count.aiReports}</strong>개
            </span>
            <span className="text-muted-foreground">
              알림: <strong>{user._count.notifications}</strong>개
            </span>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">관심종목 목록</h2>
        {watchlistLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !watchlist?.length ? (
          <div className="py-8 text-center text-muted-foreground">관심종목이 없습니다</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>종목명</TableHead>
                <TableHead>종목코드</TableHead>
                <TableHead>시장</TableHead>
                <TableHead>등록일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.stock.corpName}</TableCell>
                  <TableCell>{item.stock.stockCode}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.stock.market || '-'}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>유저 삭제</DialogTitle>
            <DialogDescription>
              {user.email || user.name || '이 유저'}를 삭제하시겠습니까? 관련된 모든 데이터가
              삭제되며, 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
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
    </div>
  )
}
