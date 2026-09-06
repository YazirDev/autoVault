'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Receipt,
  GasPump,
  Wrench,
  ShieldCheck,
  Tag,
  ArrowDown,
  ArrowUp,
} from '@phosphor-icons/react'
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal'
import { useExpenses } from '@/lib/hooks'

const CATEGORY_CONFIG = {
  FUEL:        { label: 'Combustible',   icon: GasPump,     color: '#539091' },
  MAINTENANCE: { label: 'Mantenimiento', icon: Wrench,      color: '#68C3B7' },
  INSURANCE:   { label: 'Seguro',        icon: ShieldCheck, color: '#A8DCD9' },
  TAX:         { label: 'Impuesto',      icon: Tag,         color: '#CCEAE8' },
  REPAIR:      { label: 'Reparación',    icon: Wrench,      color: '#D97706' },
  PARKING:     { label: 'Parqueo',       icon: Receipt,     color: '#6B9E9F' },
  TOLL:        { label: 'Peaje',         icon: Receipt,     color: '#A8DCD9' },
  OTHER:       { label: 'Otro',          icon: Receipt,     color: '#6B9E9F' },
}

type SortField = 'date' | 'amount'
type SortDir   = 'asc'  | 'desc'

function ExpenseSkeleton() {
  return (
    <div className="grid grid-cols-12 px-5 py-3.5 items-center gap-2">
      {[4, 3, 2, 2, 1].map((span, i) => (
        <div
          key={i}
          className={`col-span-${span} h-4 rounded animate-pulse`}
          style={{ backgroundColor: 'var(--surface-overlay)' }}
        />
      ))}
    </div>
  )
}

export default function ExpensesPage() {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir,   setSortDir]   = useState<SortDir>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: expenses, isLoading, isError } = useExpenses()

  const sorted = [...(expenses ?? [])].sort((a, b) => {
    if (sortField === 'date') {
      return sortDir === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    return sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount
  })

  const total = (expenses ?? []).reduce((s, e) => s + Number(e.amount), 0)

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortField(field); setSortDir('desc') }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
            Gastos
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
            {isLoading ? 'Cargando...' : (
              <>
                Total:{' '}
                <span className="tabular font-semibold" style={{ color: 'var(--ink)' }}>
                  ₡{total.toLocaleString('es-CR')}
                </span>
              </>
            )}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ backgroundColor: 'var(--teal-400)', color: '#FFFFFF' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--teal-500)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(83,144,145,0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--teal-400)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Plus size={15} weight="bold" />
          Registrar gasto
        </button>
      </motion.div>

      {/* Error */}
      {isError && (
        <div
          className="rounded-xl p-6 text-center mb-6"
          style={{ backgroundColor: 'var(--danger-muted)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            Error al cargar los gastos. Verifica que el backend esté corriendo.
          </p>
        </div>
      )}

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--surface-border)',
        }}
      >
        {/* Header tabla */}
        <div
          className="grid grid-cols-12 px-5 py-3 text-xs font-medium uppercase tracking-widest"
          style={{
            color: 'var(--ink-muted)',
            borderBottom: '1px solid var(--surface-border)',
            backgroundColor: 'var(--surface-elevated)',
          }}
        >
          <div className="col-span-4">Descripción</div>
          <div className="col-span-3">Vehículo</div>
          <div className="col-span-2">Categoría</div>
          <div
            className="col-span-2 flex items-center gap-1 cursor-pointer select-none transition-colors duration-150"
            style={{ color: sortField === 'amount' ? 'var(--teal-400)' : 'var(--ink-muted)' }}
            onClick={() => toggleSort('amount')}
          >
            Monto
            {sortField === 'amount'
              ? sortDir === 'desc'
                ? <ArrowDown size={11} weight="bold" />
                : <ArrowUp size={11} weight="bold" />
              : <ArrowDown size={11} weight="regular" style={{ opacity: 0.4 }} />
            }
          </div>
          <div
            className="col-span-1 flex items-center gap-1 cursor-pointer select-none"
            style={{ color: sortField === 'date' ? 'var(--teal-400)' : 'var(--ink-muted)' }}
            onClick={() => toggleSort('date')}
          >
            Fecha
            {sortField === 'date'
              ? sortDir === 'desc'
                ? <ArrowDown size={11} weight="bold" />
                : <ArrowUp size={11} weight="bold" />
              : <ArrowDown size={11} weight="regular" style={{ opacity: 0.4 }} />
            }
          </div>
        </div>

        {/* Skeletons */}
        {isLoading && (
          <>
            <ExpenseSkeleton />
            <ExpenseSkeleton />
            <ExpenseSkeleton />
            <ExpenseSkeleton />
          </>
        )}

        {/* Estado vacío */}
        {!isLoading && !isError && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Receipt size={28} weight="duotone" style={{ color: 'var(--ink-disabled)', marginBottom: 12 }} />
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
              Sin gastos registrados
            </p>
            <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
              Registra tu primer gasto para empezar el seguimiento
            </p>
          </div>
        )}

        {/* Filas */}
        {!isLoading && sorted.map((expense, i) => {
          const cfg = CATEGORY_CONFIG[expense.category as keyof typeof CATEGORY_CONFIG]
            ?? CATEGORY_CONFIG.OTHER
          return (
            <div
              key={expense.id}
              className="grid grid-cols-12 px-5 py-3.5 items-center transition-colors duration-150 cursor-pointer"
              style={{
                borderBottom: i < sorted.length - 1 ? '1px solid var(--surface-border)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-overlay)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div className="col-span-4 flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${cfg.color}18` }}
                >
                  <cfg.icon size={13} weight="duotone" style={{ color: cfg.color }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {expense.description ?? cfg.label}
                </span>
              </div>

              <div className="col-span-3">
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {expense.vehicle
                    ? `${expense.vehicle.brand} ${expense.vehicle.model}`
                    : '—'
                  }
                </span>
              </div>

              <div className="col-span-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>

              <div className="col-span-2">
                <span className="tabular text-sm font-semibold" style={{ color: 'var(--danger)' }}>
                  -₡{Number(expense.amount).toLocaleString('es-CR')}
                </span>
              </div>

              <div className="col-span-1">
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(expense.date).toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </motion.div>

      <CreateExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}