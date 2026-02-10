import { Skeleton, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@gs/ui'

export function FinancialStatementsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Tabs skeleton */}
      <div className="flex gap-1">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>

      {/* Table skeleton */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">
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
          {Array.from({ length: 6 }).map((_, rowIdx) => (
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
    </div>
  )
}
