'use client'

import { useState, useLayoutEffect, useRef } from 'react'
import {
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
  cn,
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
import { FinancialChart } from './financial-chart'
import { GrowthChart } from './growth-chart'

const ACCOUNT_ROWS: AccountKey[] = [
  'revenue',
  'operatingProfit',
  'netIncome',
  'totalAssets',
  'totalLiabilities',
  'totalEquity',
]

const MODE_OPTIONS: { value: FinancialViewMode; label: string }[] = [
  { value: 'quarterly', label: '분기별' },
  { value: 'yearly', label: '연도별' },
]

interface SegmentControlProps {
  value: FinancialViewMode
  onChange: (value: FinancialViewMode) => void
}

/**
 * iOS 스타일 세그먼트 컨트롤 컴포넌트
 * 연도별/분기별 재무제표 뷰 모드를 전환합니다
 */
export function SegmentControl({ value, onChange }: SegmentControlProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useLayoutEffect(() => {
    const activeButton = buttonRefs.current[value]
    const container = containerRef.current
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      })
    }
  }, [value])

  return (
    <div ref={containerRef} className="bg-muted relative inline-flex rounded-lg p-1">
      <div
        className="bg-background absolute top-1 bottom-1 rounded-md shadow-sm transition-all duration-200 ease-out"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
      {MODE_OPTIONS.map(option => (
        <button
          key={option.value}
          ref={el => {
            buttonRefs.current[option.value] = el
          }}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'relative z-10 rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-200',
            value === option.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

interface FinancialTableContentProps {
  corpCode: string
  mode: FinancialViewMode
}

/**
 * 재무제표 테이블 콘텐츠 컴포넌트
 */
export function FinancialTableContent({ corpCode, mode }: FinancialTableContentProps) {
  const { data } = useFinancials(corpCode, mode)
  return <FinancialTablesOnly data={data.data} />
}

interface SummaryChartsContentProps {
  corpCode: string
  mode: FinancialViewMode
}

/**
 * 요약 탭용 차트 콘텐츠 컴포넌트
 */
export function SummaryChartsContent({ corpCode, mode }: SummaryChartsContentProps) {
  const { data } = useFinancials(corpCode, mode)
  return <SummaryChartsOnly data={data.data} />
}

interface KeyMetricsSectionProps {
  corpCode: string
  mode: FinancialViewMode
}

/**
 * 주요 지표 섹션 컴포넌트
 */
export function KeyMetricsSection({ corpCode, mode }: KeyMetricsSectionProps) {
  const { data } = useFinancials(corpCode, mode)

  if (data.data.length === 0) {
    return null
  }

  return (
    <section>
      <div className="md:hidden">
        <div className="mb-3 px-4">
          <h3 className="text-base font-semibold">주요 지표</h3>
        </div>
        <div className="overflow-x-auto px-4">
          <RatioTable data={data.data} />
        </div>
      </div>
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>주요 지표</CardTitle>
          </CardHeader>
          <CardContent>
            <RatioTable data={data.data} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
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

/**
 * 요약 탭용 차트 전용 컴포넌트
 */
function SummaryChartsOnly({ data }: { data: FinancialData[] }) {
  if (data.length === 0) {
    return <div className="text-muted-foreground py-8 text-center">재무 데이터가 없습니다</div>
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 수익성 섹션 */}
      <section>
        <div className="md:hidden">
          <div className="mb-3 flex items-center gap-2 px-4">
            <h3 className="text-base font-semibold">수익성</h3>
            <span className="text-muted-foreground text-xs">매출·순이익 성장률</span>
          </div>
          <div className="space-y-6 px-4">
            <ProfitabilityCards data={data} />
            <FinancialChart data={data} />
          </div>
        </div>
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>수익성</span>
                <span className="text-muted-foreground text-sm font-normal">
                  매출·순이익 성장률
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfitabilityCards data={data} />
              <FinancialChart data={data} />
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="bg-background h-6 md:hidden" />

      {/* 성장성 섹션 */}
      <section>
        <div className="md:hidden">
          <div className="mb-3 flex items-center gap-2 px-4">
            <h3 className="text-base font-semibold">성장성</h3>
            <span className="text-muted-foreground text-xs">영업이익 추이</span>
          </div>
          <div className="space-y-6 px-4">
            <GrowthCards data={data} />
            <GrowthChart data={data} />
          </div>
        </div>
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>성장성</span>
                <span className="text-muted-foreground text-sm font-normal">영업이익 추이</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <GrowthCards data={data} />
              <GrowthChart data={data} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

/**
 * 재무제표 탭용 테이블 전용 컴포넌트
 */
function FinancialTablesOnly({ data }: { data: FinancialData[] }) {
  if (data.length === 0) {
    return <div className="text-muted-foreground py-8 text-center">재무 데이터가 없습니다</div>
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 주요 지표 */}
      <section>
        <div className="md:hidden">
          <div className="mb-3 px-4">
            <h3 className="text-base font-semibold">주요 지표</h3>
          </div>
          <div className="overflow-x-auto px-4">
            <RatioTable data={data} />
          </div>
        </div>
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>주요 지표</CardTitle>
            </CardHeader>
            <CardContent>
              <RatioTable data={data} />
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="bg-background h-6 md:hidden" />

      {/* 재무 현황 */}
      <section>
        <div className="md:hidden">
          <div className="mb-3 flex items-center justify-between px-4">
            <h3 className="text-base font-semibold">재무 현황</h3>
            <span className="text-muted-foreground text-sm">단위: 억원</span>
          </div>
          <div className="overflow-x-auto px-4">
            <AccountTable data={data} />
          </div>
        </div>
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>재무 현황</span>
                <span className="text-muted-foreground text-sm font-normal">단위: 억원</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AccountTable data={data} />
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

function formatLargeNumber(value: number | null): string {
  if (value === null) return '-'
  const absValue = Math.abs(value)
  if (absValue >= 1_0000_0000_0000) {
    return `${(value / 1_0000_0000_0000).toFixed(1)}조`
  }
  return `${Math.round(value / 1_0000_0000).toLocaleString()}억`
}

function generateProfitSummary(
  label: string,
  netIncome: number | null,
  changePercent: number | null
): string {
  if (netIncome === null) return ''
  const formattedValue = formatLargeNumber(netIncome)
  if (changePercent === null) {
    return `${label} 순이익은 ${formattedValue}이에요.`
  }
  const direction = changePercent > 0 ? '높아졌어요' : changePercent < 0 ? '낮아졌어요' : '동일해요'
  const absChange = Math.abs(changePercent).toFixed(2)
  return `${label} 순이익은 ${formattedValue}으로 직전 분기 대비 ${changePercent > 0 ? '+' : ''}${absChange}% ${direction}`
}

function ProfitabilityCards({ data }: { data: FinancialData[] }) {
  const latest = data[0]
  const previous = data[1]

  if (!latest) {
    return <div className="text-muted-foreground py-4 text-center text-sm">데이터가 없습니다</div>
  }

  const netMargin = calculateNetMargin(latest.netIncome, latest.revenue)
  const prevNetMargin = previous ? calculateNetMargin(previous.netIncome, previous.revenue) : null
  const netIncomeChange =
    previous && latest.netIncome && previous.netIncome
      ? ((latest.netIncome - previous.netIncome) / Math.abs(previous.netIncome)) * 100
      : null
  const summaryText = generateProfitSummary(latest.label, latest.netIncome, netIncomeChange)

  const items = [
    {
      label: '매출',
      value: formatLargeNumber(latest.revenue),
      change:
        previous && latest.revenue && previous.revenue
          ? ((latest.revenue - previous.revenue) / Math.abs(previous.revenue)) * 100
          : null,
    },
    {
      label: '순이익',
      value: formatLargeNumber(latest.netIncome),
      change: netIncomeChange,
    },
    {
      label: '순이익률',
      value: netMargin !== null ? `${netMargin.toFixed(1)}%` : '-',
      change: netMargin !== null && prevNetMargin !== null ? netMargin - prevNetMargin : null,
      isPercentPoint: true,
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{summaryText}</p>
      <div className="grid grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.label} className="space-y-1">
            <p className="text-muted-foreground text-xs">{item.label}</p>
            <p className="text-lg font-semibold tabular-nums">{item.value}</p>
            {item.change !== null && (
              <p
                className={cn(
                  'text-xs tabular-nums',
                  item.change > 0
                    ? 'text-red-500'
                    : item.change < 0
                      ? 'text-blue-500'
                      : 'text-muted-foreground'
                )}
              >
                {item.change > 0 ? '+' : ''}
                {item.change.toFixed(1)}
                {item.isPercentPoint ? '%p' : '%'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function generateGrowthSummary(
  label: string,
  operatingProfit: number | null,
  changePercent: number | null
): string {
  if (operatingProfit === null) return ''
  const formattedValue = formatLargeNumber(operatingProfit)
  if (changePercent === null) {
    return `${label} 영업이익은 ${formattedValue}이에요.`
  }
  const direction = changePercent > 0 ? '증가했어요' : changePercent < 0 ? '감소했어요' : '동일해요'
  const absChange = Math.abs(changePercent).toFixed(2)
  return `${label} 영업이익은 ${formattedValue}으로 직전 대비 ${changePercent > 0 ? '+' : ''}${absChange}% ${direction}`
}

function GrowthCards({ data }: { data: FinancialData[] }) {
  const latest = data[0]
  const previous = data[1]

  if (!latest) {
    return <div className="text-muted-foreground py-4 text-center text-sm">데이터가 없습니다</div>
  }

  const operatingMargin = calculateOperatingMargin(latest.operatingProfit, latest.revenue)
  const prevOperatingMargin = previous
    ? calculateOperatingMargin(previous.operatingProfit, previous.revenue)
    : null
  const operatingProfitChange =
    previous && latest.operatingProfit && previous.operatingProfit
      ? ((latest.operatingProfit - previous.operatingProfit) / Math.abs(previous.operatingProfit)) *
        100
      : null
  const summaryText = generateGrowthSummary(
    latest.label,
    latest.operatingProfit,
    operatingProfitChange
  )

  const items = [
    {
      label: '영업이익',
      value: formatLargeNumber(latest.operatingProfit),
      change: operatingProfitChange,
    },
    {
      label: '영업이익률',
      value: operatingMargin !== null ? `${operatingMargin.toFixed(1)}%` : '-',
      change:
        operatingMargin !== null && prevOperatingMargin !== null
          ? operatingMargin - prevOperatingMargin
          : null,
      isPercentPoint: true,
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{summaryText}</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.label} className="space-y-1">
            <p className="text-muted-foreground text-xs">{item.label}</p>
            <p className="text-lg font-semibold tabular-nums">{item.value}</p>
            {item.change !== null && (
              <p
                className={cn(
                  'text-xs tabular-nums',
                  item.change > 0
                    ? 'text-red-500'
                    : item.change < 0
                      ? 'text-blue-500'
                      : 'text-muted-foreground'
                )}
              >
                {item.change > 0 ? '+' : ''}
                {item.change.toFixed(1)}
                {item.isPercentPoint ? '%p' : '%'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
