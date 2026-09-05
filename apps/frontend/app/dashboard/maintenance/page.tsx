'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wrench, Warning, CheckCircle, Clock } from '@phosphor-icons/react'

const MOCK_MAINTENANCE = [
  {
    id: '1',
    type: 'Cambio de aceite',
    vehicle: 'Toyota Corolla 2020',
    date: '2026-09-04',
    km: 45000,
    cost: 35000,
    nextDueKm: 50000,
    nextDueDate: '2026-12-04',
    status: 'done',
  },
  {
    id: '2',
    type: 'Revisión de frenos',
    vehicle: 'Honda Civic 2019',
    date: '2026-09-01',
    km: 62000,
    cost: 45000,
    nextDueKm: 72000,
    nextDueDate: '2026-12-01',
    status: 'done',
  },
  {
    id: '3',
    type: 'Cambio de llantas',
    vehicle: 'Toyota Corolla 2020',
    date: null,
    km: null,
    cost: null,
    nextDueKm: 50000,
    nextDueDate: '2026-09-10',
    status: 'upcoming',
  },
  {
    id: '4',
    type: 'Sincronización',
    vehicle: 'Honda Civic 2019',
    date: null,
    km: null,
    cost: null,
    nextDueKm: 65000,
    nextDueDate: '2026-10-15',
    status: 'scheduled',
  },
]

const STATUS_CONFIG = {
  done: {
    label: 'Completado',
    icon: CheckCircle,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.10)',
  },
  upcoming: {
    label: 'Próximo',
    icon: Warning,
    color: '#D97706',
    bg: 'rgba(217,119,6,0.10)',
  },
  scheduled: {
    label: 'Programado',
    icon: Clock,
    color: '#539091',
    bg: 'rgba(83,144,145,0.10)',
  },
}

export default function MaintenancePage() {
  const [records] = useState(MOCK_MAINTENANCE)

  const upcoming = records.filter(r => r.status === 'upcoming')
  const rest     = records.filter(r => r.status !== 'upcoming')

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
            Mantenimiento
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
            {records.length} registros · {upcoming.length} próximo{upcoming.length !== 1 ? 's' : ''}
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
          Registrar mantenimiento
        </button>
      </motion.div>

      {/* Alertas de próximos */}
      {upcoming.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6"
        >
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              backgroundColor: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.20)',
            }}
          >
            <Warning size={18} weight="duotone" style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: '#D97706' }}>
                {upcoming.length} mantenimiento{upcoming.length !== 1 ? 's' : ''} próximo{upcoming.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs" style={{ color: 'var(--ink-secondary)' }}>
                {upcoming.map(u => `${u.type} — ${u.vehicle}`).join(' · ')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de registros */}
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
        {/* Header */}
        <div
          className="grid grid-cols-12 px-5 py-3 text-xs font-medium uppercase tracking-widest"
          style={{
            color: 'var(--ink-muted)',
            borderBottom: '1px solid var(--surface-border)',
            backgroundColor: 'var(--surface-elevated)',
          }}
        >
          <div className="col-span-3">Tipo</div>
          <div className="col-span-3">Vehículo</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-2">KM</div>
          <div className="col-span-1">Costo</div>
          <div className="col-span-1">Estado</div>
        </div>

        {/* Filas */}
        {[...upcoming, ...rest].map((record, i) => {
          const status = STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG]
          return (
            <div
              key={record.id}
              className="grid grid-cols-12 px-5 py-3.5 items-center transition-colors duration-150 cursor-pointer"
              style={{
                borderBottom: i < records.length - 1 ? '1px solid var(--surface-border)' : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* Tipo */}
              <div className="col-span-3 flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(83,144,145,0.10)' }}
                >
                  <Wrench size={13} weight="duotone" style={{ color: 'var(--teal-400)' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {record.type}
                </span>
              </div>

              {/* Vehículo */}
              <div className="col-span-3">
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {record.vehicle}
                </span>
              </div>

              {/* Fecha */}
              <div className="col-span-2">
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {record.date
                    ? new Date(record.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })
                    : (
                      <span style={{ color: '#D97706' }}>
                        {new Date(record.nextDueDate!).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                      </span>
                    )
                  }
                </span>
              </div>

              {/* KM */}
              <div className="col-span-2">
                <span className="tabular text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {record.km
                    ? `${record.km.toLocaleString('es-CR')} km`
                    : <span style={{ color: '#D97706' }}>{record.nextDueKm?.toLocaleString('es-CR')} km</span>
                  }
                </span>
              </div>

              {/* Costo */}
              <div className="col-span-1">
                <span className="tabular text-sm font-medium" style={{ color: record.cost ? 'var(--ink)' : 'var(--ink-disabled)' }}>
                  {record.cost ? `₡${record.cost.toLocaleString('es-CR')}` : '—'}
                </span>
              </div>

              {/* Estado */}
              <div className="col-span-1">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-fit"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  <status.icon size={10} weight="bold" />
                  {status.label}
                </span>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}