'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wrench, Warning, CheckCircle, Clock } from '@phosphor-icons/react'
import { CreateMaintenanceModal } from '@/components/maintenance/CreateMaintenanceModal'
import { useMaintenance, useUpcomingMaintenance } from '@/lib/hooks'

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

function getStatus(record: { date: string | null; nextDueDate?: string | null }) {
  if (record.date) return 'done'
  if (!record.nextDueDate) return 'scheduled'
  const due = new Date(record.nextDueDate)
  const now = new Date()
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7 ? 'upcoming' : 'scheduled'
}

function MaintenanceSkeleton() {
  return (
    <div className="grid grid-cols-12 px-5 py-3.5 items-center gap-2">
      {[3, 3, 2, 2, 1, 1].map((span, i) => (
        <div
          key={i}
          className={`col-span-${span} h-4 rounded animate-pulse`}
          style={{ backgroundColor: 'var(--surface-overlay)' }}
        />
      ))}
    </div>
  )
}

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: records, isLoading, isError } = useMaintenance()
  const { data: upcoming } = useUpcomingMaintenance(7)

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
            {isLoading ? 'Cargando...' : (
              `${records?.length ?? 0} registros · ${upcoming?.length ?? 0} próximo${(upcoming?.length ?? 0) !== 1 ? 's' : ''}`
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
          Registrar mantenimiento
        </button>
      </motion.div>

      {/* Alerta próximos */}
      {upcoming && upcoming.length > 0 && (
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
                {upcoming.length} mantenimiento{upcoming.length !== 1 ? 's' : ''} en los próximos 7 días
              </p>
              <p className="text-xs" style={{ color: 'var(--ink-secondary)' }}>
                {upcoming.map(u => `${u.type} — ${u.vehicle?.brand} ${u.vehicle?.model}`).join(' · ')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="rounded-xl p-6 text-center mb-6"
          style={{ backgroundColor: 'var(--danger-muted)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            Error al cargar los mantenimientos. Verifica que el backend esté corriendo.
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

        {/* Skeletons */}
        {isLoading && (
          <>
            <MaintenanceSkeleton />
            <MaintenanceSkeleton />
            <MaintenanceSkeleton />
          </>
        )}

        {/* Estado vacío */}
        {!isLoading && !isError && (!records || records.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16">
            <Wrench size={28} weight="duotone" style={{ color: 'var(--ink-disabled)', marginBottom: 12 }} />
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
              Sin registros de mantenimiento
            </p>
            <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
              Registra el primer mantenimiento de tus vehículos
            </p>
          </div>
        )}

        {/* Filas */}
        {!isLoading && records?.map((record, i) => {
          const status = STATUS_CONFIG[getStatus(record) as keyof typeof STATUS_CONFIG]
          return (
            <div
              key={record.id}
              className="grid grid-cols-12 px-5 py-3.5 items-center transition-colors duration-150 cursor-pointer"
              style={{
                borderBottom: i < (records.length - 1) ? '1px solid var(--surface-border)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-overlay)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
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

              <div className="col-span-3">
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {record.vehicle
                    ? `${record.vehicle.brand} ${record.vehicle.model}`
                    : '—'
                  }
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {record.date
                    ? new Date(record.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })
                    : record.nextDueDate
                      ? <span style={{ color: '#D97706' }}>
                          {new Date(record.nextDueDate).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                        </span>
                      : '—'
                  }
                </span>
              </div>

              <div className="col-span-2">
                <span className="tabular text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {record.km
                    ? `${record.km.toLocaleString('es-CR')} km`
                    : record.nextDueKm
                      ? <span style={{ color: '#D97706' }}>{record.nextDueKm.toLocaleString('es-CR')} km</span>
                      : '—'
                  }
                </span>
              </div>

              <div className="col-span-1">
                <span className="tabular text-sm font-medium" style={{ color: record.cost ? 'var(--ink)' : 'var(--ink-disabled)' }}>
                  {record.cost ? `₡${Number(record.cost).toLocaleString('es-CR')}` : '—'}
                </span>
              </div>

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

      <CreateMaintenanceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}