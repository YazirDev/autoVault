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

const CATEGORY_CONFIG = {
  FUEL:        { label: 'Combustible',   icon: GasPump,     color: '#539091' },
  MAINTENANCE: { label: 'Mantenimiento', icon: Wrench,      color: '#68C3B7' },
  INSURANCE:   { label: 'Seguro',        icon: ShieldCheck, color: '#A8DCD9' },
  TAX:         { label: 'Impuesto',      icon: Tag,         color: '#CCEAE8' },
  REPAIR:      { label: 'Reparación',    icon: Wrench,      color: '#D97706' },
  OTHER:       { label: 'Otro',          icon: Receipt,     color: '#6B9E9F' },
}

const MOCK_EXPENSES = [
  { id: '1', category: 'FUEL',        amount: 18500,  date: '2026-09-05', description: 'Gasolina',          vehicle: 'Toyota Corolla 2020' },
  { id: '2', category: 'MAINTENANCE', amount: 35000,  date: '2026-09-04', description: 'Cambio de aceite',  vehicle: 'Honda Civic 2019'    },
  { id: '3', category: 'INSURANCE',   amount: 95000,  date: '2026-09-03', description: 'Seguro trimestral', vehicle: 'Toyota Corolla 2020' },
  { id: '4', category: 'FUEL',        amount: 22000,  date: '2026-09-02', description: 'Gasolina',          vehicle: 'Honda Civic 2019'    },
  { id: '5', category: 'REPAIR',      amount: 45000,  date: '2026-09-01', description: 'Frenos delanteros', vehicle: 'Toyota Corolla 2020' },
  { id: '6', category: 'FUEL',        amount: 19500,  date: '2026-08-30', description: 'Gasolina',          vehicle: 'Honda Civic 2019'    },
]

type SortField = 'date' | 'amount'
type SortDir   = 'asc'  | 'desc'

export default function ExpensesPage() {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir,   setSortDir]   = useState<SortDir>('desc')

  const sorted = [...MOCK_EXPENSES].sort((a, b) => {
    if (sortField === 'date') {
      return sortDir === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    return sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount
  })

  const total = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0)

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
            Total: <span className="tabular font-semibold" style={{ color: 'var(--ink)' }}>
              ₡{total.toLocaleString('es-CR')}
            </span>
          </p>
        </div>

        <button
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
            className="col-span-1 flex items-center gap-1 cursor-pointer select-none transition-colors duration-150"
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

        {/* Filas */}
        {sorted.map((expense, i) => {
          const cfg = CATEGORY_CONFIG[expense.category as keyof typeof CATEGORY_CONFIG]
          return (
            <div
              key={expense.id}
              className="grid grid-cols-12 px-5 py-3.5 items-center transition-colors duration-150 cursor-pointer"
              style={{
                borderBottom: i < sorted.length - 1 ? '1px solid var(--surface-border)' : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* Descripción */}
              <div className="col-span-4 flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${cfg.color}18` }}
                >
                  <cfg.icon size={13} weight="duotone" style={{ color: cfg.color }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {expense.description}
                </span>
              </div>

              {/* Vehículo */}
              <div className="col-span-3">
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {expense.vehicle}
                </span>
              </div>

              {/* Categoría */}
              <div className="col-span-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${cfg.color}18`,
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Monto */}
              <div className="col-span-2">
                <span
                  className="tabular text-sm font-semibold"
                  style={{ color: 'var(--danger)' }}
                >
                  -₡{expense.amount.toLocaleString('es-CR')}
                </span>
              </div>

              {/* Fecha */}
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
    </div>
  )
}