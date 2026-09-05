'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GoogleLogo, Car, ChartLine, ShieldCheck } from '@phosphor-icons/react'

export function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    console.log('Iniciando Google OAuth...')
  }

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      {/* ── Panel izquierdo ──────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12"
        style={{ backgroundColor: 'var(--surface-base)' }}
      >
        {/* Gradiente de fondo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 50%, rgba(104,195,183,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 80% 20%, rgba(204,234,232,0.06) 0%, transparent 60%)
            `,
          }}
        />

        {/* Grid sutil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(83,144,145,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(83,144,145,1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(83,144,145,0.12)',
              border: '1px solid rgba(83,144,145,0.25)',
            }}
          >
            <Car size={16} weight="duotone" style={{ color: 'var(--teal-400)' }} />
          </div>
          <span className="font-medium tracking-tight" style={{ color: 'var(--ink)' }}>
            AutoVault
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10"
        >
          <h1
            className="text-4xl font-semibold tracking-tight leading-[1.15] mb-4"
            style={{ color: 'var(--ink)' }}
          >
            Conoce el costo{' '}
            <span className="gradient-text">real</span>{' '}
            de tu vehículo
          </h1>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: 'var(--ink-secondary)' }}>
            Registra gastos, analiza tendencias y descubre cuánto te cuesta
            cada kilómetro — todo en un solo lugar.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {[
              { icon: ChartLine, text: 'Reportes financieros en tiempo real' },
              { icon: ShieldCheck, text: 'Datos cifrados y seguros en la nube' },
              { icon: Car,        text: 'Múltiples vehículos en una cuenta'   },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(83,144,145,0.10)' }}
                >
                  <item.icon size={12} weight="bold" style={{ color: 'var(--teal-400)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="relative z-10 text-xs"
          style={{ color: 'var(--ink-disabled)' }}
        >
          © 2026 AutoVault. Todos los derechos reservados.
        </motion.p>
      </div>

      {/* ── Divisor ───────────────────────────────────────── */}
      <div className="hidden lg:block w-px" style={{ backgroundColor: 'var(--surface-border)' }} />

      {/* ── Panel derecho ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(83,144,145,0.12)',
                border: '1px solid rgba(83,144,145,0.25)',
              }}
            >
              <Car size={16} weight="duotone" style={{ color: 'var(--teal-400)' }} />
            </div>
            <span className="font-medium tracking-tight" style={{ color: 'var(--ink)' }}>
              AutoVault
            </span>
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <h2
              className="text-2xl font-semibold tracking-tight mb-1.5"
              style={{ color: 'var(--ink)' }}
            >
              Bienvenido de vuelta
            </h2>
            <p className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
              Inicia sesión para continuar con tu cuenta
            </p>
          </div>

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 h-11 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: 'var(--ink)',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--surface-border-hover)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
              e.currentTarget.style.borderColor = 'rgba(83,144,145,0.4)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(83,144,145,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--surface-elevated)'
              e.currentTarget.style.borderColor = 'var(--surface-border-hover)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? (
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{
                  borderColor: 'var(--ink-disabled)',
                  borderTopColor: 'var(--teal-400)',
                }}
              />
            ) : (
              <GoogleLogo size={18} weight="bold" style={{ color: 'var(--ink-secondary)' }} />
            )}
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--surface-border)' }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--ink-disabled)' }}>o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--surface-border)' }} />
          </div>

          {/* Card seguridad */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
            }}
          >
            <div className="flex gap-3">
              <ShieldCheck
                size={16}
                weight="duotone"
                className="flex-shrink-0 mt-0.5"
                style={{ color: 'var(--teal-400)' }}
              />
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--ink)' }}>
                  Conexión segura
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  Tus datos se cifran en tránsito y en reposo.
                  Nunca compartimos información con terceros.
                </p>
              </div>
            </div>
          </div>

          {/* Términos */}
          <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: 'var(--ink-disabled)' }}>
            Al continuar aceptas nuestros{' '}
            <span
              className="cursor-pointer transition-colors duration-150"
              style={{ color: 'var(--ink-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
            >
              Términos de servicio
            </span>{' '}
            y{' '}
            <span
              className="cursor-pointer transition-colors duration-150"
              style={{ color: 'var(--ink-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
            >
              Política de privacidad
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}