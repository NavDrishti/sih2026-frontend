/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: 'rgb(var(--color-industrial-950) / <alpha-value>)',
          900: 'rgb(var(--color-industrial-900) / <alpha-value>)',
          850: 'rgb(var(--color-industrial-850) / <alpha-value>)',
          800: 'rgb(var(--color-industrial-800) / <alpha-value>)',
          750: 'rgb(var(--color-industrial-750) / <alpha-value>)',
          700: 'rgb(var(--color-industrial-700) / <alpha-value>)',
          600: 'rgb(var(--color-industrial-600) / <alpha-value>)',
          500: 'rgb(var(--color-industrial-500) / <alpha-value>)',
          400: 'rgb(var(--color-industrial-400) / <alpha-value>)',
          300: 'rgb(var(--color-industrial-300) / <alpha-value>)',
          200: 'rgb(var(--color-industrial-200) / <alpha-value>)',
          100: 'rgb(var(--color-industrial-100) / <alpha-value>)',
        },
        sentinel: {
          sidebar: '#0c1322',
          'sidebar-border': '#152033',
          'sidebar-hover': '#141e32',
          green: '#16a34a',
          'green-light': '#22c55e',
          'green-dark': '#15803d',
          'green-subtle': '#dcfce7',
          canvas: 'rgb(var(--color-sentinel-canvas) / <alpha-value>)',
          card: 'rgb(var(--color-sentinel-card) / <alpha-value>)',
          'card-border': 'rgb(var(--color-sentinel-card-border) / <alpha-value>)',
          navy: '#0f172a',
          slate: '#334155',
          muted: '#64748b',
          light: '#f8fafc',
          border: 'rgb(var(--color-sentinel-border) / <alpha-value>)',
        },
        hazard: {
          red: '#ef4444',
          'red-glow': 'rgba(239, 68, 68, 0.25)',
          'red-dark': 'rgb(var(--hazard-red-dark) / <alpha-value>)',
          'red-border': 'rgb(var(--hazard-red-border) / <alpha-value>)',
          amber: 'rgb(var(--hazard-amber) / <alpha-value>)',
          'amber-glow': 'rgba(245, 158, 11, 0.25)',
          'amber-dark': 'rgb(var(--hazard-amber-dark) / <alpha-value>)',
          'amber-border': 'rgb(var(--hazard-amber-border) / <alpha-value>)',
          cyan: 'rgb(var(--hazard-cyan) / <alpha-value>)',
          'cyan-glow': 'rgba(6, 182, 212, 0.25)',
          'cyan-dark': 'rgb(var(--hazard-cyan-dark) / <alpha-value>)',
          'cyan-border': 'rgb(var(--hazard-cyan-border) / <alpha-value>)',
          teal: '#14b8a6',
          green: '#10b981',
          'green-dark': 'rgb(var(--hazard-green-dark) / <alpha-value>)',
          'green-border': 'rgb(var(--hazard-green-border) / <alpha-value>)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'hazard-red': '0 0 15px -3px rgba(239, 68, 68, 0.45)',
        'hazard-amber': '0 0 15px -3px rgba(245, 158, 11, 0.35)',
        'safety-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
}
