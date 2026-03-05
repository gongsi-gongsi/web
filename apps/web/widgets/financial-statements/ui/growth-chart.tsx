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

/**
 * 성장성 차트 컴포넌트
 * 영업이익(막대)과 영업이익률(선)을 표시합니다
 * @param data - 재무 데이터 배열
 */
export function GrowthChart({ data }: GrowthChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        차트 데이터가 없습니다
      </div>
    )
  }

  const chartData = data.map(d => ({
    label: d.label,
    operatingProfit: d.operatingProfit ?? 0,
    operatingMargin: calculateOperatingMargin(d.operatingProfit, d.revenue) ?? 0,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v: number) => `${v.toFixed(1)}%`}
            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number | undefined, name: string) => {
              if (value === undefined) return ['-', name]
              if (name === '영업이익률') return [`${value.toFixed(1)}%`, name]
              return [formatValue(value), name]
            }}
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar
            yAxisId="left"
            dataKey="operatingProfit"
            name="영업이익"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="operatingMargin"
            name="영업이익률"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
