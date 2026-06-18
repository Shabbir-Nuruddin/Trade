/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#070b14',
          800: '#0b1120',
          700: '#111a2e',
          600: '#1a2540',
          500: '#26324f',
        },
        accent: {
          DEFAULT: '#10b981',
          soft: '#34d399',
          dim: '#065f46',
        },
        up: '#22c55e',
        down: '#f43f5e',
        warn: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.35)',
        glow: '0 0 40px rgba(16,185,129,0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
