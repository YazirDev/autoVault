'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Car } from '@phosphor-icons/react'
import { VehicleCard } from '@/components/vehicles/VehicleCard'

const MOCK_VEHICLES = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    licensePlate: 'ABC-123',
    fuelType: 'GASOLINE' as const,
    currentKm: 45230,
    monthlyExpense: 98500,
    lastExpense: 'Hace 2 días',
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2019,
    licensePlate: 'XYZ-456',
    fuelType: 'GASOLINE' as const,
    currentKm: 62100,
    monthlyExpense: 50000,
    lastExpense: 'Ayer',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { ease: [0.23, 1, 0.32, 1], duration: 0.4 } },
}

export default function VehiclesPage() {
  const [vehicles] = useState(MOCK_VEHICLES)

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
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            Vehículos
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
            {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} registrado{vehicles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Botón agregar */}
        <button
          className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            backgroundColor: 'var(--teal-400)',
            color: '#FFFFFF',
          }}
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

      {/* Grid de vehículos */}
      {vehicles.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {vehicles.map(vehicle => (
            <motion.div key={vehicle.id} variants={item}>
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Estado vacío */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center justify-center py-24 rounded-xl"
          style={{
            border: '1px dashed var(--surface-border-hover)',
          }}
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
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--teal-400)', color: '#FFFFFF' }}
          >
            <Plus size={15} weight="bold" />
            Agregar vehículo
          </button>
        </motion.div>
      )}
    </div>
  )
}