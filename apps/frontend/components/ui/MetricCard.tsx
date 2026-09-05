import { ArrowUp, ArrowDown } from '@phosphor-icons/react'

interface MetricCardProps {
  label: string
  value: string
  change?: number
  changeLabel?: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  change,
  changeLabel,
  prefix = '',
  suffix = '',
  icon,
}: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0
  const isExpense = label.toLowerCase().includes('gasto')
  // Para gastos, positivo es malo (gastaste más)
  const isGood = isExpense ? !isPositive : isPositive

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-200"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--surface-border-hover)'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(83,144,145,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--surface-border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Label e icono */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>
          {label}
        </p>
        {icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(83,144,145,0.10)' }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Valor principal */}
      <p
        className="tabular text-3xl font-semibold tracking-tight"
        style={{ color: 'var(--ink)' }}
      >
        {prefix}{value}{suffix}
      </p>

      {/* Cambio vs período anterior */}
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: isGood
                ? 'var(--success-muted)'
                : 'var(--danger-muted)',
              color: isGood ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {isPositive
              ? <ArrowUp size={11} weight="bold" />
              : <ArrowDown size={11} weight="bold" />
            }
            {Math.abs(change)}%
          </div>
          <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
            {changeLabel ?? 'vs mes anterior'}
          </span>
        </div>
      )}
    </div>
  )
}