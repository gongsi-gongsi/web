'use client'

import { useState } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
import { useFinancials, getAccountLabel } from '@/entities/company'
import type { FinancialViewMode, FinancialData, AccountKey } from '@/entities/company'
import {
  formatToEok,
  formatPercent,
  calculateROE,
  calculateROA,
  calculateOperatingMargin,
  calculateNetMargin,
  calculateDebtRatio,
} from '../lib/format-display'

interface FinancialStatementsProps {
  corpCode: string
  initialMode?: FinancialViewMode
}

const ACCOUNT_ROWS: AccountKey[] = [
  'revenue',
  'operatingProfit',
  'netIncome',
  'totalAssets',
  'totalLiabilities',
  'totalEquity',
]

export function FinancialStatements({
  corpCode,
  initialMode = 'yearly',
}: FinancialStatementsProps) {
  const [mode, setMode] = useState<FinancialViewMode>(initialMode)
  const { data } = useFinancials(corpCode, mode)

  const handleModeChange = (value: string) => {
    setMode(value as FinancialViewMode)
  }

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={handleModeChange}>
        <div className="px-4 md:px-0">
          <TabsList>
            <TabsTrigger value="yearly">연도별</TabsTrigger>
            <TabsTrigger value="quarterly">분기별</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="yearly">
          <FinancialTable data={data.data} />
        </TabsContent>

        <TabsContent value="quarterly">
          <FinancialTable data={data.data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface FinancialTableProps {
  data: FinancialData[]
}

type RatioKey = 'roe' | 'roa' | 'operatingMargin' | 'netMargin' | 'debtRatio'

const RATIO_ROWS: { key: RatioKey; label: string }[] = [
  { key: 'roe', label: 'ROE' },
  { key: 'roa', label: 'ROA' },
  { key: 'operatingMargin', label: '영업이익률' },
  { key: 'netMargin', label: '순이익률' },
  { key: 'debtRatio', label: '부채비율' },
]

function getRatioValue(data: FinancialData, key: RatioKey): number | null {
  switch (key) {
    case 'roe':
      return calculateROE(data.netIncome, data.totalEquity)
    case 'roa':
      return calculateROA(data.netIncome, data.totalAssets)
    case 'operatingMargin':
      return calculateOperatingMargin(data.operatingProfit, data.revenue)
    case 'netMargin':
      return calculateNetMargin(data.netIncome, data.revenue)
    case 'debtRatio':
      return calculateDebtRatio(data.totalLiabilities, data.totalEquity)
    default:
      return null
  }
}

function FinancialTable({ data }: FinancialTableProps) {
  if (data.length === 0) {
    return <div className="text-muted-foreground py-8 text-center">재무 데이터가 없습니다</div>
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 주요 계정 */}
      <section>
        {/* 모바일: 카드 없이 */}
        <div className="md:hidden">
          <div className="mb-3 flex items-center justify-between px-4">
            <h3 className="text-base font-semibold">주요 계정</h3>
            <span className="text-muted-foreground text-sm">단위: 억원</span>
          </div>
          <div className="overflow-x-auto px-4">
            <AccountTable data={data} />
          </div>
        </div>

        {/* PC: 카드 형태 */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>주요 계정</span>
                <span className="text-muted-foreground text-sm font-normal">단위: 억원</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AccountTable data={data} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 주요 비율 */}
      <section>
        {/* 모바일: 카드 없이 */}
        <div className="md:hidden">
          <div className="mb-3 flex items-center justify-between px-4">
            <h3 className="text-base font-semibold">주요 지표</h3>
            <span className="text-muted-foreground text-sm">단위: %</span>
          </div>
          <div className="overflow-x-auto px-4">
            <RatioTable data={data} />
          </div>
        </div>

        {/* PC: 카드 형태 */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>주요 지표</span>
                <span className="text-muted-foreground text-sm font-normal">단위: %</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RatioTable data={data} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function AccountTable({ data }: { data: FinancialData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">항목</TableHead>
          {data.map(item => (
            <TableHead key={item.label} className="text-right">
              {item.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {ACCOUNT_ROWS.map(accountKey => (
          <TableRow key={accountKey}>
            <TableCell className="font-medium">{getAccountLabel(accountKey)}</TableCell>
            {data.map(item => (
              <TableCell key={item.label} className="text-right tabular-nums">
                {formatToEok(item[accountKey])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function RatioTable({ data }: { data: FinancialData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">지표</TableHead>
          {data.map(item => (
            <TableHead key={item.label} className="text-right">
              {item.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {RATIO_ROWS.map(({ key, label }) => (
          <TableRow key={key}>
            <TableCell className="font-medium">{label}</TableCell>
            {data.map(item => (
              <TableCell key={item.label} className="text-right tabular-nums">
                {formatPercent(getRatioValue(item, key))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
