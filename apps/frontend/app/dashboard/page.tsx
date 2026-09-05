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

const METRICS = [
  {
    label: 'Gasto del mes',
    value: '148,500',
    prefix: '₡',
    change: 12,
    icon: <Receipt size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
  },
  {
    label: 'Vehículos activos',
    value: '2',
    change: 0,
    changeLabel: 'sin cambios',
    icon: <Car size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
  },
  {
    label: 'Costo por km',
    value: '87',
    prefix: '₡',
    suffix: '/km',
    change: -5,
    icon: <Gauge size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
  },
  {
    label: 'Mantenimientos',
    value: '1',
    changeLabel: 'pendiente este mes',
    icon: <Wrench size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { ease: [0.23, 1, 0.32, 1], duration: 0.4 } },
}

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-8"
      >
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          Resumen
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
          Septiembre 2026 — Vista general de tus finanzas vehiculares
        </p>
      </motion.div>

      {/* Métricas */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {METRICS.map(metric => (
          <motion.div key={metric.label} variants={item}>
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Fila principal — gráfico + actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico de gastos */}
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
              <h2
                className="text-sm font-semibold"
                style={{ color: 'var(--ink)' }}
              >
                Gastos mensuales
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                Enero — Septiembre 2026
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
              style={{
                backgroundColor: 'rgba(83,144,145,0.08)',
                color: 'var(--teal-400)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--teal-400)' }} />
              Todos los vehículos
            </div>
          </div>
          <MonthlyChart />
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
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  )
}