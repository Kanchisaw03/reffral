/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Orbitron"', 'ui-sans-serif', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        glass: 'rgba(30,41,59,0.6)',
        neon: '#38bdf8',
        violet: '#a78bfa',
        card: 'rgba(17,24,39,0.7)',
        background: '#0C0C0C',
        surface: '#1A1A1A',
        primary: '#FFFFFF',
        accent: '#C0C0C0',
        glow: '#EAEAEA',
        border: '#888888',
        muted: '#444444',
        input: '#1B1B1B',
      },
      boxShadow: {
        glow: '0 0 16px 2px #38bdf8, 0 0 32px 4px #a78bfa40',
        card: '0 4px 32px 0 rgba(56,189,248,0.10)',
        textGlow: '0 0 10px rgba(56,189,248,0.7), 0 0 20px #a78bfa',
        soft: '0 0 30px rgba(255,255,255,0.1)',
        borderGlow: '0 0 12px rgba(56,189,248,0.3)',
      },
      textShadow: {
        glow: '0 0 8px #38bdf8, 0 0 16px #a78bfa',
      },
      borderRadius: {
        none: '0px',
      },
      maxWidth: {
        covenant: '1024px',
      },
      padding: {
        covenant: '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      addUtilities({
        '.text-glow': {
          textShadow: '0 0 8px #38bdf8, 0 0 16px #a78bfa',
        },
        '.bg-glass': {
          background: 'rgba(30,41,59,0.6)',
          backdropFilter: 'blur(12px)',
        },
      });
    },
  ],
}

