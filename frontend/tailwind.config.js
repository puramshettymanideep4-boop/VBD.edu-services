/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Antigravity Palette
        'space-black':  '#0A0A0F',
        'space-dark':   '#0F0F1A',
        'card-dark':    '#13131F',
        'primary':      '#C8A96E',   // gold
        'primary-hover': '#E8C898',
        'gold':         '#C8A96E',
        'gold-hover':   '#E8C898',
        'gold-soft':    '#E8C898',
        // Semantic
        'success':  '#4ADE80',
        'warning':  '#FBBF24',
        'danger':   '#F87171',
        'info':     '#60A5FA',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      backdropBlur: {
        'glass': '20px',
        'nav':   '24px',
      },
      boxShadow: {
        'float':       '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(200,169,110,0.08)',
        'float-hover': '0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(200,169,110,0.15)',
        'gold-glow':   '0 0 20px rgba(200,169,110,0.3), 0 0 60px rgba(200,169,110,0.1)',
        'gold-active': '0 0 30px rgba(200,169,110,0.5), 0 0 80px rgba(200,169,110,0.2)',
        'btn-gold':    '0 4px 14px rgba(200,169,110,0.3)',
        'btn-gold-hover': '0 8px 24px rgba(200,169,110,0.4)',
        'glass':       '0 8px 32px rgba(0,0,0,0.37)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
