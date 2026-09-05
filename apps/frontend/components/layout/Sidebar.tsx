'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car,
  ChartLine,
  Wrench,
  Receipt,
  ChartPie,
  Gear,
  SignOut,
  CaretRight,
} from '@phosphor-icons/react'

const NAV_ITEMS = [
  {
    label: 'Resumen',
    href: '/dashboard',
    icon: ChartLine,
    exact: true,
  },
  {
    label: 'Vehículos',
    href: '/dashboard/vehicles',
    icon: Car,
    exact: false,
  },
  {
    label: 'Gastos',
    href: '/dashboard/expenses',
    icon: Receipt,
    exact: false,
  },
  {
    label: 'Mantenimiento',
    href: '/dashboard/maintenance',
    icon: Wrench,
    exact: false,
  },
  {
    label: 'Reportes',
    href: '/dashboard/reports',
    icon: ChartPie,
    exact: false,
  },
]

function NavItem({
  item,
  active,
}: {
  item: (typeof NAV_ITEMS)[number]
  active: boolean
}) {
  return (
    <Link href={item.href} className="block relative group">
      {/* Indicador activo */}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-lg"
          style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        />
      )}

      <div
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
        style={{
          color: active ? 'var(--indigo-400)' : 'var(--ink-secondary)',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.color = 'var(--ink)'
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.color = 'var(--ink-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <item.icon
          size={17}
          weight={active ? 'duotone' : 'regular'}
        />
        <span
          className="text-sm font-medium flex-1"
        >
          {item.label}
        </span>
        {active && (
          <CaretRight size={12} weight="bold" style={{ color: 'var(--indigo-400)', opacity: 0.6 }} />
        )}
      </div>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col h-full"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderRight: '1px solid var(--surface-border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--surface-border)' }}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          <Car size={14} weight="duotone" style={{ color: 'var(--indigo-400)' }} />
        </div>
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          AutoVault
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Label de sección */}
        <p
          className="text-xs font-medium uppercase tracking-widest px-3 mb-2"
          style={{ color: 'var(--ink-disabled)' }}
        >
          Menú
        </p>

        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.href}
              item={item}
              active={isActive(item)}
            />
          ))}
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid var(--surface-border)' }}
      >
        {/* Configuración */}
        <Link href="/dashboard/settings" className="block">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer"
            style={{ color: 'var(--ink-secondary)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--ink)'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--ink-secondary)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Gear size={17} weight="regular" />
            <span className="text-sm font-medium">Configuración</span>
          </div>
        </Link>

        {/* Usuario */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-0.5 transition-colors duration-150 cursor-pointer"
          style={{ color: 'var(--ink-secondary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--danger)'
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--ink-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <SignOut size={17} weight="regular" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </div>
      </div>
    </aside>
  )
}