'use client'

import { motion } from 'framer-motion'
import {
  Receipt,
  Car,
  Gauge,
  Wrench,
} from '@phosphor-icons/react'
import { MetricCard } from '@/components/ui/MetricCard'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useVehicles, useExpenses, useMonthlySummary, useUpcomingMaintenance } from '@/lib/hooks'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { ease: [0.23, 1, 0.32, 1], duration: 0.4 } },
}

function MetricSkeleton() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--surface-overlay)' }} />
        <div className="w-7 h-7 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--surface-overlay)' }} />
      </div>
      <div className="h-9 w-32 rounded animate-pulse" style={{ backgroundColor: 'var(--surface-overlay)' }} />
      <div className="h-4 w-28 rounded animate-pulse" style={{ backgroundColor: 'var(--surface-overlay)' }} />
    </div>
  )
}

export default function DashboardPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const fromDate = new Date(year, month, 1).toISOString().split('T')[0]!
  const toDate   = new Date(year, month + 1, 0).toISOString().split('T')[0]!
  const prevFrom = new Date(year, month - 1, 1).toISOString().split('T')[0]!
  const prevTo   = new Date(year, month, 0).toISOString().split('T')[0]!

  const { data: vehicles,   isLoading: loadingVehicles  } = useVehicles()
  const { data: expenses,   isLoading: loadingExpenses  } = useExpenses()
  const { data: monthly,    isLoading: loadingMonthly   } = useMonthlySummary(year)
  const { data: upcoming,   isLoading: loadingUpcoming  } = useUpcomingMaintenance(30)

  const isLoading = loadingVehicles || loadingExpenses || loadingMonthly || loadingUpcoming

  // Calcula gasto del mes actual
  const currentMonthExpenses = (expenses ?? []).filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === month && d.getFullYear() === year
  })
  const currentTotal = currentMonthExpenses.reduce((s, e) => s + Number(e.amount), 0)

  // Calcula gasto del mes anterior
  const prevMonthExpenses = (expenses ?? []).filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === month - 1 && d.getFullYear() === year
  })
  const prevTotal = prevMonthExpenses.reduce((s, e) => s + Number(e.amount), 0)

  // Cambio porcentual
  const monthChange = prevTotal > 0
    ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100)
    : 0

  // Costo por km aproximado
  const totalExpensesAll = (expenses ?? []).reduce((s, e) => s + Number(e.amount), 0)
  const totalKm = (vehicles ?? []).reduce((s, v) => s + v.currentKm, 0)
  const cpk = totalKm > 0 ? Math.round(totalExpensesAll / totalKm) : 0

  const metrics = [
    {
      label: 'Gasto del mes',
      value: currentTotal.toLocaleString('es-CR'),
      prefix: '₡',
      change: monthChange,
      icon: <Receipt size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
    },
    {
      label: 'Vehículos activos',
      value: String(vehicles?.length ?? 0),
      changeLabel: 'registrados',
      icon: <Car size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
    },
    {
      label: 'Costo por km',
      value: cpk.toLocaleString('es-CR'),
      prefix: '₡',
      suffix: '/km',
      icon: <Gauge size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
    },
    {
      label: 'Mantenimientos',
      value: String(upcoming?.length ?? 0),
      changeLabel: 'próximos 30 días',
      icon: <Wrench size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
          Resumen
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
          {now.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })} — Vista general de tus finanzas vehiculares
        </p>
      </motion.div>

      {/* Métricas */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <MetricSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {metrics.map(metric => (
            <motion.div key={metric.label} variants={item}>
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Fila principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico mensual */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-2 rounded-xl p-5"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                Gastos mensuales
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                {year}
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
              style={{ backgroundColor: 'rgba(83,144,145,0.08)', color: 'var(--teal-400)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--teal-400)' }} />
              Todos los vehículos
            </div>
          </div>

          {/* Pasa datos reales al gráfico si existen */}
          <MonthlyChart data={monthly} />
        </motion.div>

        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Actividad reciente
            </h2>
            <button
              className="text-xs transition-colors duration-150"
              style={{ color: 'var(--teal-400)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal-300)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--teal-400)')}
            >
              Ver todo
            </button>
          </div>
          <RecentActivity expenses={expenses?.slice(0, 4)} />
        </motion.div>
      </div>
    </div>
  )
}