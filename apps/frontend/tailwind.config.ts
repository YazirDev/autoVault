import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Superficies — de más oscuro a más claro
        surface: {
          base: '#07070C',      // fondo raíz
          DEFAULT: '#0D0D14',   // fondo principal
          card: '#12121A',      // cards y paneles
          elevated: '#18181F',  // elementos elevados
          overlay: '#1E1E28',   // overlays, modales
          border: '#ffffff0F',  // bordes sutiles (6% white)
          'border-hover': '#ffffff1A', // bordes hover (10% white)
        },
        // Acento principal — Indigo
        indigo: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Texto
        ink: {
          DEFAULT: '#F0EFFF',   // texto primario (tinte indigo suave)
          secondary: '#9998B8', // texto secundario
          muted: '#4E4D68',     // texto muted
          disabled: '#2E2D45',  // texto deshabilitado
        },
        // Semánticos
        success: '#22C55E',
        'success-muted': '#22C55E1A',
        danger: '#EF4444',
        'danger-muted': '#EF44441A',
        warning: '#F59E0B',
        'warning-muted': '#F59E0B1A',
        info: '#6366F1',
        'info-muted': '#6366F11A',
      },

      fontFamily: {
        sans: ['GeistVariable', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['GeistMonoVariable', 'GeistMono', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:   ['0.75rem',  { lineHeight: '1.125rem' }],
        sm:   ['0.8125rem',{ lineHeight: '1.25rem' }],
        base: ['0.9375rem',{ lineHeight: '1.5rem' }],
        lg:   ['1.0625rem',{ lineHeight: '1.625rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':['1.5rem',   { lineHeight: '2rem' }],
        '3xl':['1.875rem', { lineHeight: '2.375rem' }],
        '4xl':['2.25rem',  { lineHeight: '2.75rem' }],
        '5xl':['3rem',     { lineHeight: '3.5rem' }],
      },

      borderRadius: {
        sm:   '6px',
        DEFAULT: '8px',
        md:   '10px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'20px',
      },

      boxShadow: {
        // Sombras basadas en indigo para dar profundidad con color
        'glow-sm': '0 0 12px -2px rgba(99,102,241,0.25)',
        'glow':    '0 0 24px -4px rgba(99,102,241,0.35)',
        'glow-lg': '0 0 48px -8px rgba(99,102,241,0.45)',
        'card':    '0 1px 0 0 rgba(255,255,255,0.04), 0 4px 16px -2px rgba(0,0,0,0.4)',
        'elevated':'0 1px 0 0 rgba(255,255,255,0.06), 0 8px 32px -4px rgba(0,0,0,0.5)',
      },

      // Curvas de easing custom — Emil Kowalski philosophy
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-expo': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
      },

      animation: {
        'fade-in':   'fade-in 150ms cubic-bezier(0.23, 1, 0.32, 1)',
        'slide-up':  'slide-up 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'slide-down':'slide-down 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'scale-in':  'scale-in 150ms cubic-bezier(0.23, 1, 0.32, 1)',
        'shimmer':   'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config