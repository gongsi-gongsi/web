'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { FinancialData } from '@/entities/company'
import { calculateNetMargin } from '../lib/format-display'

interface FinancialChartProps {
  data: FinancialData[]
}

interface ChartDataItem {
  label: string
  revenue: number | null
  netIncome: number | null
  netMargin: number | null
}

function transformData(data: FinancialData[]): ChartDataItem[] {
  return [...data].reverse().map(item => ({
    label: item.label,
    revenue: item.revenue,
    netIncome: item.netIncome,
    netMargin: calculateNetMargin(item.netIncome, item.revenue),
  }))
}

/**
 * 숫자를 억/조 단위로 포맷팅
 */
function formatValue(value: number | null): string {
  if (value === null) return '-'
  const absValue = Math.abs(value)
  if (absValue >= 1_0000_0000_0000) {
    return `${(value / 1_0000_0000_0000).toFixed(1)}조`
  }
  return `${(value / 1_0000_0000).toLocaleString(undefined, { maximumFractionDigits: 0 })}억`
}

function formatYAxis(value: number): string {
  if (value === 0) return '0'
  if (Math.abs(value) >= 1_0000_0000_0000) {
    return `${(value / 1_0000_0000_0000).toFixed(0)}조`
  }
  if (Math.abs(value) >= 1_0000_0000) {
    return `${(value / 1_0000_0000).toFixed(0)}억`
  }
  return value.toLocaleString()
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    dataKey: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-popover border-border rounded-lg border p-3 shadow-md">
      <p className="text-foreground mb-2 text-sm font-medium">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{' '}
          {entry.dataKey === 'netMargin' ? `${entry.value?.toFixed(1)}%` : formatValue(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function FinancialChart({ data }: FinancialChartProps) {
  const chartData = transformData(data)

  if (chartData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        차트 데이터가 없습니다
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="fill-muted-foreground"
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="fill-muted-foreground"
            width={50}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={value => `${value}%`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="fill-muted-foreground"
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={value => <span className="text-foreground">{value}</span>}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="매출"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Bar
            yAxisId="left"
            dataKey="netIncome"
            name="순이익"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="netMargin"
            name="순이익률"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
