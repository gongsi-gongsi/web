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
  Input,
  Skeleton,
} from '@gs/ui'
import { MagnifyingGlass, Eye } from '@phosphor-icons/react'
import { useUsers } from '@/entities/user'

export function UserListWidget() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useUsers({ page, search: search || undefined })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative max-w-sm flex-1">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="이메일 또는 이름으로 검색"
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          검색
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="py-12 text-center text-muted-foreground">유저가 없습니다</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이메일</TableHead>
                <TableHead>이름</TableHead>
                <TableHead className="w-28">관심종목</TableHead>
                <TableHead className="w-36">가입일</TableHead>
                <TableHead className="w-20">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email || '-'}</TableCell>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>{user._count.watchlist}개</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/users/${user.id}`}>
                        <Eye size={16} />
                      </Link>
                    </Button>
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
    </>
  )
}
