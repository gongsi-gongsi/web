import type { CompoundInput } from '../model/calculate-compound'

interface CalculatorFormProps {
  value: CompoundInput
  onChange: (value: CompoundInput) => void
}

interface FieldConfig {
  label: string
  key: keyof CompoundInput
  min: number
  max: number
  step: number
  unit: string
  format: (v: number) => string
}

const FIELDS: FieldConfig[] = [
  {
    label: '초기 원금',
    key: 'principal',
    min: 0,
    max: 100000000,
    step: 1000000,
    unit: '원',
    format: v => v.toLocaleString('ko-KR'),
  },
  {
    label: '월 적립금',
    key: 'monthly',
    min: 0,
    max: 10000000,
    step: 100000,
    unit: '원',
    format: v => v.toLocaleString('ko-KR'),
  },
  {
    label: '연 이율',
    key: 'annualRate',
    min: 0,
    max: 50,
    step: 0.1,
    unit: '%',
    format: v => v.toFixed(1),
  },
  {
    label: '투자 기간',
    key: 'years',
    min: 1,
    max: 50,
    step: 1,
    unit: '년',
    format: v => String(v),
  },
]

export function CalculatorForm({ value, onChange }: CalculatorFormProps) {
  function handleChange(key: keyof CompoundInput, raw: string) {
    const num = parseFloat(raw.replace(/,/g, ''))
    if (isNaN(num)) return
    const field = FIELDS.find(f => f.key === key)
    const clamped = field ? Math.min(field.max, Math.max(field.min, num)) : num
    onChange({ ...value, [key]: clamped })
  }

  return (
    <div className="flex flex-col gap-5">
      {FIELDS.map(field => {
        const pct = ((value[field.key] - field.min) / (field.max - field.min)) * 100

        return (
          <div key={field.key}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor={field.key} className="shrink-0 text-sm font-semibold text-foreground">
                {field.label}
              </label>
              <div className="border-input flex items-center gap-1 rounded-lg border bg-transparent px-2 py-1">
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  aria-label={`${field.label} 직접 입력`}
                  className="w-24 bg-transparent text-right text-sm font-bold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-xs text-foreground/70">{field.unit}</span>
              </div>
            </div>
            <input
              id={field.key}
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={value[field.key]}
              onChange={e => handleChange(field.key, e.target.value)}
              aria-label={field.label}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #fbbf24 ${pct}%, #6b7280 ${pct}%)`,
              }}
            />
            <div className="mt-1 flex justify-between text-[10px] text-foreground/60">
              <span>
                {field.format(field.min)}
                {field.unit}
              </span>
              <span>
                {field.format(field.max)}
                {field.unit}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
