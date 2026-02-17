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
import { calculateOperatingMargin } from '../lib/format-display'

interface GrowthChartProps {
  data: FinancialData[]
}

interface ChartDataItem {
  label: string
  operatingProfit: number | null
  operatingMargin: number | null
}

/**
 * 재무 데이터를 차트용 데이터로 변환합니다
 */
function transformData(data: FinancialData[]): ChartDataItem[] {
  return data.map(item => ({
    label: item.label,
    operatingProfit: item.operatingProfit,
    operatingMargin: calculateOperatingMargin(item.operatingProfit, item.revenue),
  }))
}

/**
 * 숫자를 억/조 단위로 포맷팅합니다
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
    value: number | null
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
          {entry.dataKey === 'operatingMargin'
            ? `${entry.value?.toFixed(1)}%`
            : formatValue(entry.value)}
        </p>
      ))}
    </div>
  )
}

/**
 * 성장성 차트 컴포넌트
 * 영업이익(막대)과 영업이익률(선)을 표시합니다
 * @param data - 재무 데이터 배열
 */
export function GrowthChart({ data }: GrowthChartProps) {
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
            dataKey="operatingProfit"
            name="영업이익"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="operatingMargin"
            name="영업이익률"
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
