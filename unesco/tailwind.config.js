import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A0E18',
        surface: 'rgba(18, 24, 42, 0.88)',
        frost: 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(255, 255, 255, 0.12)',
        accent1: '#4ADE80',
        accent2: '#5B7BFF',
        accent3: '#C084FC',
        glow: 'rgba(59, 130, 246, 0.18)',
        textHigh: '#F8FAFC',
        textMid: '#CBD5E1',
        textLow: '#94A3B8',
        deepCharcoal: '#070B16',
        nightNavy: '#0C1324',
        electricBlue: '#5FB9FF',
        emerald: '#4ADE80',
        violet: '#C084FC',
        frostedWhite: '#F8FAFC',
        softGray: '#8CA0B3',
        graphite: '#17233B'
      },
      boxShadow: {
        glow: '0 0 48px rgba(95, 185, 255, 0.14)',
        soft: '0 24px 90px rgba(11, 14, 34, 0.28)',
        innerFrost: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(95, 185, 255, 0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(76, 214, 128, 0.12), transparent 30%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config

