/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Green
        primary: '#006e2f',
        'primary-container': '#22c55e',
        'on-primary': '#ffffff',
        'on-primary-container': '#004b1e',

        // Secondary: Orange
        secondary: '#9d4300',
        'secondary-container': '#fd761a',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#5c2400',

        // Tertiary: Blue
        tertiary: '#005ac2',
        'tertiary-container': '#82abff',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#003d88',

        // Error: Red
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        // Surface & Background
        background: '#f8f9fa',
        surface: '#f8f9fa',
        'surface-dim': '#d9dadb',
        'surface-bright': '#f8f9fa',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f4f5',
        'surface-container': '#edeeef',
        'surface-container-high': '#e7e8e9',
        'surface-container-highest': '#e1e3e4',
        'surface-tint': '#006e2f',
        'on-surface': '#191c1d',
        'on-surface-variant': '#3d4a3d',

        // Other
        outline: '#6d7b6c',
        'outline-variant': '#bccbb9',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f2',
        'inverse-primary': '#4ae176',
      },
      fontFamily: {
        'display-lg': ['Inter'],
        'headline-lg': ['Inter'],
        'headline-md': ['Inter'],
        'body-lg': ['Inter'],
        'body-md': ['Inter'],
        'label-md': ['Inter'],
        'stats-number': ['Inter'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.04em', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'stats-number': ['20px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      spacing: {
        'base': '8px',
        'gutter': '16px',
        'stack-sm': '12px',
        'stack-md': '24px',
        'stack-lg': '48px',
        'container-padding-mobile': '20px',
        'container-padding-desktop': '40px',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'DEFAULT': '4px',
        'lg': '8px',
        'xl': '12px',
        'full': '9999px',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(16px)',
      },
    },
  },
  plugins: [],
}
