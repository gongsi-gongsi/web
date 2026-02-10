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

function TableSkeleton({ rows = 6 }: { rows?: number }) {
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
