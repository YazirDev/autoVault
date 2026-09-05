'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Car,
  ChartLine,
  Wrench,
  Receipt,
  ChartPie,
  Bell,
  MagnifyingGlass,
} from '@phosphor-icons/react'

const NAV_ITEMS = [
  { label: 'Resumen',       href: '/dashboard',             icon: ChartLine, exact: true  },
  { label: 'Vehículos',     href: '/dashboard/vehicles',    icon: Car,       exact: false },
  { label: 'Gastos',        href: '/dashboard/expenses',    icon: Receipt,   exact: false },
  { label: 'Mantenimiento', href: '/dashboard/maintenance', icon: Wrench,    exact: false },
  { label: 'Reportes',      href: '/dashboard/reports',     icon: ChartPie,  exact: false },
]

export function TopBar() {
  const pathname = usePathname()

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <header
      className="flex-shrink-0 flex items-center h-14 px-6 gap-6"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderBottom: '1px solid var(--surface-border)',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(83,144,145,0.12)',
            border: '1px solid rgba(83,144,145,0.25)',
          }}
        >
          <Car size={14} weight="duotone" style={{ color: 'var(--teal-400)' }} />
        </div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
          AutoVault
        </span>
      </Link>

      {/* Divisor */}
      <div className="h-5 w-px flex-shrink-0" style={{ backgroundColor: 'var(--surface-border)' }} />

      {/* Navegación */}
      <nav className="flex items-center gap-0.5 flex-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150"
              style={{ color: active ? 'var(--ink)' : 'var(--ink-secondary)' }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--ink)'
                  e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--ink-secondary)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {active && (
                <motion.div
                  layoutId="topbar-indicator"
                  className="absolute inset-0 rounded-md"
                  style={{ backgroundColor: 'rgba(83,144,145,0.10)' }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                />
              )}
              <item.icon
                size={15}
                weight={active ? 'duotone' : 'regular'}
                style={{
                  color: active ? 'var(--teal-400)' : 'inherit',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
              <span className="relative z-10">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="topbar-underline"
                  className="absolute bottom-0 left-3 right-3 h-px"
                  style={{ backgroundColor: 'var(--teal-400)' }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Acciones derecha */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="flex items-center gap-2 px-3 h-8 rounded-md text-xs font-medium transition-all duration-150"
          style={{
            color: 'var(--ink-secondary)',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--surface-border)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--ink)'
            e.currentTarget.style.borderColor = 'var(--surface-border-hover)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--ink-secondary)'
            e.currentTarget.style.borderColor = 'var(--surface-border)'
          }}
        >
          <MagnifyingGlass size={13} />
          <span>Buscar</span>
          <span
            className="ml-1 px-1 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--surface-overlay)',
              color: 'var(--ink-disabled)',
              fontSize: '10px',
            }}
          >
            ⌘K
          </span>
        </button>

        <button
          className="relative w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150"
          style={{ color: 'var(--ink-secondary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--ink)'
            e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--ink-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Bell size={16} weight="regular" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--teal-400)' }}
          />
        </button>

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-150"
          style={{
            backgroundColor: 'rgba(83,144,145,0.12)',
            border: '1px solid rgba(83,144,145,0.25)',
            color: 'var(--teal-400)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(83,144,145,0.20)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(83,144,145,0.12)'
          }}
        >
          Y
        </button>
      </div>
    </header>
  )
}