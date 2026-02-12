import {
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@gs/ui'

interface TableSkeletonProps {
  rows?: number
}

function TableSkeleton({ rows = 6 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">
            <Skeleton className="h-4 w-12" />
          </TableHead>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableHead key={i} className="text-right">
              <Skeleton className="ml-auto h-4 w-12" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <TableCell key={colIdx} className="text-right">
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function FinancialTableSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* 재무 현황 */}
      <section>
        {/* 모바일 */}
        <div className="md:hidden">
          <div className="mb-3 flex items-center justify-between px-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="overflow-x-auto px-4">
            <TableSkeleton rows={6} />
          </div>
        </div>

        {/* PC */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={6} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 모바일 구분선 */}
      <div className="bg-background h-6 md:hidden" />

      {/* 주요 지표 */}
      <section>
        {/* 모바일 */}
        <div className="md:hidden">
          <div className="mb-3 flex items-center justify-between px-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="overflow-x-auto px-4">
            <TableSkeleton rows={5} />
          </div>
        </div>

        {/* PC */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-12" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

/**
 * 주요 지표 섹션 스켈레톤
 */
export function KeyMetricsSkeleton() {
  return (
    <section>
      <div className="md:hidden">
        <div className="mb-3 px-4">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="overflow-x-auto px-4">
          <TableSkeleton rows={5} />
        </div>
      </div>
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={5} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

/**
 * 차트 스켈레톤 (요약 탭용)
 */
function ChartSkeleton() {
  return (
    <div className="h-[200px] w-full">
      <div className="flex h-full items-end justify-between gap-2 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-t"
              style={{ height: `${40 + Math.random() * 60}%` }}
            />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 요약 탭용 차트 스켈레톤
 * 수익성/성장성 섹션의 카드와 차트를 표시합니다
 */
export function SummaryChartsSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* 수익성 섹션 */}
      <section>
        {/* 모바일 */}
        <div className="md:hidden">
          <div className="mb-3 flex items-center gap-2 px-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-6 px-4">
            {/* 카드 3개 */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
            <ChartSkeleton />
          </div>
        </div>

        {/* PC */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-28" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>
              </div>
              <ChartSkeleton />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 모바일 구분선 */}
      <div className="bg-background h-6 md:hidden" />

      {/* 성장성 섹션 */}
      <section>
        {/* 모바일 */}
        <div className="md:hidden">
          <div className="mb-3 flex items-center gap-2 px-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="space-y-6 px-4">
            {/* 카드 2개 */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-6 w-14" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
            <ChartSkeleton />
          </div>
        </div>

        {/* PC */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>
              </div>
              <ChartSkeleton />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

/** @deprecated Use FinancialTableSkeleton instead */
export function FinancialStatementsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Segment control skeleton */}
      <div className="px-4 md:px-0">
        <div className="bg-muted inline-flex rounded-lg p-1">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
      <FinancialTableSkeleton />
    </div>
  )
}
