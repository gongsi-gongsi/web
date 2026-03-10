'use client'

import { Bar, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { YearlySnapshot } from '../model/calculate-compound'

interface CalculatorChartProps {
  snapshots: YearlySnapshot[]
}

function formatYAxis(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억`
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만`
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만`
  return String(value)
}

function formatTooltipValue(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}억원`
  }
  if (value >= 10000) {
    return `${(value / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`
  }
  return `${value.toLocaleString('ko-KR')}원`
}

export function CalculatorChart({ snapshots }: CalculatorChartProps) {
  const data = snapshots.map(s => ({
    year: `${s.year}년`,
    납입원금: s.principal,
    이자: Math.max(0, s.interest),
  }))

  // 5년 단위 또는 최대 10개 tick 표시
  const tickInterval = Math.max(1, Math.floor(data.length / 10))

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-foreground/70">연도별 자산 성장</p>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: 'rgba(200,210,220,0.85)' }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval - 1}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: 'rgba(200,210,220,0.85)' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#1e2030',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              fontSize: 12,
              color: '#f1f5f9',
            }}
            labelStyle={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}
            formatter={(value: number | undefined, name: string | undefined) =>
              [value !== undefined ? formatTooltipValue(value) : '', name ?? ''] as [string, string]
            }
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <Bar dataKey="납입원금" stackId="a" fill="rgba(234,179,8,0.85)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="이자" stackId="a" fill="rgba(34,197,94,0.85)" radius={[4, 4, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-4 justify-end">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: 'rgba(234,179,8,0.85)' }} />
          <span className="text-[10px] text-foreground/70">납입원금</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: 'rgba(34,197,94,0.85)' }} />
          <span className="text-[10px] text-foreground/70">이자</span>
        </div>
      </div>
    </div>
  )
}
