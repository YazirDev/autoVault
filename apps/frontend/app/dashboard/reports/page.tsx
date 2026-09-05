'use client'

import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { ChartLine, Car, TrendDown } from '@phosphor-icons/react'

const MONTHLY_DATA = [
  { mes: 'Ene', toyota: 38000, honda: 22000 },
  { mes: 'Feb', toyota: 42000, honda: 18000 },
  { mes: 'Mar', toyota: 55000, honda: 31000 },
  { mes: 'Abr', toyota: 31000, honda: 25000 },
  { mes: 'May', toyota: 48000, honda: 29000 },
  { mes: 'Jun', toyota: 27000, honda: 21000 },
  { mes: 'Jul', toyota: 52000, honda: 33000 },
  { mes: 'Ago', toyota: 44000, honda: 27000 },
  { mes: 'Sep', toyota: 39000, honda: 18500 },
]

const CATEGORY_DATA = [
  { name: 'Combustible', valor: 142000 },
  { name: 'Mantenimiento', valor: 98000 },
  { name: 'Seguro', valor: 95000 },
  { name: 'Reparación', valor: 45000 },
  { name: 'Impuesto', valor: 28000 },
  { name: 'Otro', valor: 12000 },
]

const CPK = [
  { vehicle: 'Toyota Corolla 2020', km: 45230, total: 420000, cpk: 9.28 },
  { vehicle: 'Honda Civic 2019',    km: 62100, total: 380000, cpk: 6.12 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-sm"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--surface-border-hover)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      }}
    >
      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--ink-muted)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="tabular text-xs font-medium" style={{ color: p.color }}>
          {p.name}: ₡{p.value.toLocaleString('es-CR')}
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
          Reportes
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
          Análisis financiero de tus vehículos — Enero a Septiembre 2026
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Comparativa por vehículo */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <ChartLine size={15} weight="duotone" style={{ color: 'var(--teal-400)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Gastos por vehículo
            </h2>
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--ink-muted)' }}>Comparativa mensual</p>

          <div className="flex items-center gap-4 mb-4">
            {[
              { label: 'Toyota Corolla', color: '#539091' },
              { label: 'Honda Civic',    color: '#A8DCD9' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#539091" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#539091" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A8DCD9" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#A8DCD9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(83,144,145,0.08)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: 'var(--ink-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--ink-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₡${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="toyota" name="Toyota Corolla" stroke="#539091" strokeWidth={2} fill="url(#g1)" dot={false} activeDot={{ r: 4, fill: '#539091', stroke: 'var(--surface-card)', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="honda"  name="Honda Civic"    stroke="#A8DCD9" strokeWidth={2} fill="url(#g2)" dot={false} activeDot={{ r: 4, fill: '#A8DCD9',  stroke: 'var(--surface-card)', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gastos por categoría */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-xl p-5"
          style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Car size={15} weight="duotone" style={{ color: 'var(--teal-400)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Distribución por categoría
            </h2>
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--ink-muted)' }}>Total acumulado 2026</p>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CATEGORY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(83,144,145,0.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--ink-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--ink-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₡${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" name="Total" fill="#539091" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Costo por kilómetro */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-xl p-5"
        style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendDown size={15} weight="duotone" style={{ color: 'var(--teal-400)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            Costo por kilómetro
          </h2>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--ink-muted)' }}>Eficiencia financiera por vehículo</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CPK.map((v, i) => (
            <div
              key={v.vehicle}
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--surface-border)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{v.vehicle}</p>
                <span
                  className="tabular text-lg font-semibold"
                  style={{ color: 'var(--teal-400)' }}
                >
                  ₡{v.cpk}/km
                </span>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--ink-muted)' }}>Kilometraje total</p>
                  <p className="tabular text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                    {v.km.toLocaleString('es-CR')} km
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--ink-muted)' }}>Gasto total</p>
                  <p className="tabular text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                    ₡{v.total.toLocaleString('es-CR')}
                  </p>
                </div>
              </div>

              {/* Barra de progreso visual */}
              <div className="mt-3">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--surface-overlay)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(v.cpk / 10) * 100}%`,
                      backgroundColor: i === 0 ? '#539091' : '#A8DCD9',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}