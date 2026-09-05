'use client'

import {
  Car,
  Gauge,
  Receipt,
  DotsThree,
  PencilSimple,
  Trash,
  GasPump,
} from '@phosphor-icons/react'
import { useState } from 'react'

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  licensePlate: string
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'
  currentKm: number
  monthlyExpense: number
  lastExpense?: string
}

const FUEL_LABELS = {
  GASOLINE: 'Gasolina',
  DIESEL:   'Diésel',
  ELECTRIC: 'Eléctrico',
  HYBRID:   'Híbrido',
}

const FUEL_COLORS = {
  GASOLINE: '#539091',
  DIESEL:   '#68C3B7',
  ELECTRIC: '#22C55E',
  HYBRID:   '#A8DCD9',
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 relative"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--surface-border-hover)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(83,144,145,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--surface-border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Icono del vehículo */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'rgba(83,144,145,0.10)',
              border: '1px solid rgba(83,144,145,0.15)',
            }}
          >
            <Car size={20} weight="duotone" style={{ color: 'var(--teal-400)' }} />
          </div>

          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
              {vehicle.year} · {vehicle.licensePlate}
            </p>
          </div>
        </div>

        {/* Menú de acciones */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150"
            style={{ color: 'var(--ink-muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
              e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--ink-muted)'
            }}
          >
            <DotsThree size={16} weight="bold" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 rounded-lg py-1 z-10 min-w-[140px]"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--surface-border-hover)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150"
                style={{ color: 'var(--ink-secondary)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
                  e.currentTarget.style.color = 'var(--ink)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--ink-secondary)'
                }}
              >
                <PencilSimple size={14} weight="regular" />
                Editar
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150"
                style={{ color: 'var(--danger)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--danger-muted)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Trash size={14} weight="regular" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Badge de combustible */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5"
          style={{
            backgroundColor: `${FUEL_COLORS[vehicle.fuelType]}18`,
            color: FUEL_COLORS[vehicle.fuelType],
          }}
        >
          <GasPump size={11} weight="bold" />
          {FUEL_LABELS[vehicle.fuelType]}
        </span>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 gap-3 pt-3"
        style={{ borderTop: '1px solid var(--surface-border)' }}
      >
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--ink-muted)' }}>
            Kilometraje
          </p>
          <div className="flex items-center gap-1.5">
            <Gauge size={13} weight="duotone" style={{ color: 'var(--teal-400)' }} />
            <p className="tabular text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              {vehicle.currentKm.toLocaleString('es-CR')} km
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--ink-muted)' }}>
            Gasto del mes
          </p>
          <div className="flex items-center gap-1.5">
            <Receipt size={13} weight="duotone" style={{ color: 'var(--teal-400)' }} />
            <p className="tabular text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              ₡{vehicle.monthlyExpense.toLocaleString('es-CR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}