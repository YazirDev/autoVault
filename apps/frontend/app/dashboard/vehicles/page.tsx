'use client'

import { motion } from 'framer-motion'
import { Plus, Car } from '@phosphor-icons/react'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { useVehicles } from '@/lib/hooks'
import { useState } from 'react'
import { CreateVehicleModal } from '@/components/vehicles/CreateVehicleModal'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { ease: [0.23, 1, 0.32, 1], duration: 0.4 } },
}

function VehicleSkeleton() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl animate-pulse"
          style={{ backgroundColor: 'var(--surface-overlay)' }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 w-32 rounded animate-pulse"
            style={{ backgroundColor: 'var(--surface-overlay)' }} />
          <div className="h-3 w-24 rounded animate-pulse"
            style={{ backgroundColor: 'var(--surface-overlay)' }} />
        </div>
      </div>
      <div className="h-6 w-20 rounded-md animate-pulse"
        style={{ backgroundColor: 'var(--surface-overlay)' }} />
      <div className="grid grid-cols-2 gap-3 pt-3"
        style={{ borderTop: '1px solid var(--surface-border)' }}>
        <div className="h-10 rounded animate-pulse"
          style={{ backgroundColor: 'var(--surface-overlay)' }} />
        <div className="h-10 rounded animate-pulse"
          style={{ backgroundColor: 'var(--surface-overlay)' }} />
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  const { data: vehicles, isLoading, isError } = useVehicles()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
            Vehículos
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
            {isLoading ? 'Cargando...' : `${vehicles?.length ?? 0} vehículo${(vehicles?.length ?? 0) !== 1 ? 's' : ''} registrado${(vehicles?.length ?? 0) !== 1 ? 's' : ''}`}
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
          Agregar vehículo
        </button>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <VehicleSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="rounded-xl p-6 text-center"
          style={{ backgroundColor: 'var(--danger-muted)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            Error al cargar los vehículos. Verifica que el backend esté corriendo.
          </p>
        </div>
      )}

      {/* Datos */}
      {!isLoading && !isError && vehicles && vehicles.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {vehicles.map(vehicle => (
            <motion.div key={vehicle.id} variants={item}>
              <VehicleCard
                vehicle={{
                  ...vehicle,
                  monthlyExpense: 0,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Estado vacío */}
      {!isLoading && !isError && (!vehicles || vehicles.length === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center justify-center py-24 rounded-xl"
          style={{ border: '1px dashed var(--surface-border-hover)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(83,144,145,0.08)' }}
          >
            <Car size={28} weight="duotone" style={{ color: 'var(--teal-400)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--ink)' }}>
            Sin vehículos aún
          </h3>
          <p className="text-sm text-center max-w-xs mb-6" style={{ color: 'var(--ink-secondary)' }}>
            Agrega tu primer vehículo para empezar a registrar gastos y mantenimientos.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--teal-400)', color: '#FFFFFF' }}
          >
            <Plus size={15} weight="bold" />
            Agregar vehículo
          </button>
        </motion.div>
      )}

      <CreateVehicleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}