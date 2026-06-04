/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        secondary: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        protein: '#ec4899',
        fats: '#f59e0b',
        carbs: '#3b82f6',
      },
      backgroundImage: {
        'gradient-easy': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
