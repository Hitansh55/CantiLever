/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F7F5F0',
          soft: '#EFEBE2',
        },
        ink: {
          DEFAULT: '#0D1117',
          soft: '#161B22',
          line: '#232B36',
        },
        accent: {
          DEFAULT: '#1E7F72',
          light: '#2A9D8F',
          dark: '#155E54',
        },
        amber: {
          DEFAULT: '#E8A33D',
          soft: '#F3C77E',
        },
        rose: {
          DEFAULT: '#C1554A',
        },
        ledger: {
          text: '#1A1D23',
          textDark: '#E6E8EB',
          mutedLight: '#6B7280',
          mutedDark: '#8B94A3',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,17,23,0.04), 0 8px 24px -8px rgba(13,17,23,0.12)',
        cardHover: '0 4px 10px rgba(13,17,23,0.08), 0 16px 40px -12px rgba(13,17,23,0.18)',
        glass: '0 8px 32px rgba(0,0,0,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease forwards',
      },
    },
  },
  plugins: [],
}
