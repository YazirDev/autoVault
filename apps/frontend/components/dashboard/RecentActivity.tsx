import { Receipt, Wrench, GasPump, Warning } from '@phosphor-icons/react'
import type { Expense } from '@/lib/hooks'

const CATEGORY_ICONS: Record<string, any> = {
  FUEL:        GasPump,
  MAINTENANCE: Wrench,
  REPAIR:      Wrench,
  DEFAULT:     Receipt,
}

const CATEGORY_COLORS: Record<string, string> = {
  FUEL:        '#539091',
  MAINTENANCE: '#68C3B7',
  INSURANCE:   '#A8DCD9',
  REPAIR:      '#D97706',
  DEFAULT:     '#6B9E9F',
}

interface Props {
  expenses?: Expense[]
}

export function RecentActivity({ expenses }: Props) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Receipt size={24} weight="duotone" style={{ color: 'var(--ink-disabled)', marginBottom: 8 }} />
        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Sin actividad reciente</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {expenses.map(expense => {
        const Icon = CATEGORY_ICONS[expense.category] ?? CATEGORY_ICONS.DEFAULT
        const color = CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS.DEFAULT

        return (
          <div
            key={expense.id}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 cursor-pointer"
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-overlay)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon size={15} weight="duotone" style={{ color }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>
                {expense.description ?? expense.category}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--ink-muted)' }}>
                {expense.vehicle
                  ? `${expense.vehicle.brand} ${expense.vehicle.model}`
                  : '—'
                }
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="tabular text-sm font-medium" style={{ color: 'var(--danger)' }}>
                -₡{Number(expense.amount).toLocaleString('es-CR')}
              </p>
              <p className="text-xs" style={{ color: 'var(--ink-disabled)' }}>
                {new Date(expense.date).toLocaleDateString('es-CR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}