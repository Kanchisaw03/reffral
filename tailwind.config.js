/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0C0C0C',
        surface: '#1A1A1A',
        primary: '#FFFFFF',
        accent: '#C0C0C0',
        glow: '#EAEAEA',
        border: '#888888',
        muted: '#444444',
        input: '#1B1B1B',
      },
      fontFamily: {
        heading: ['Cinzel Decorative', 'serif'],
        body: ['EB Garamond', 'serif'],
        accent: ['UnifrakturCook', 'cursive'],
      },
      boxShadow: {
        textGlow: '0 0 10px rgba(255,255,255,0.6)',
        soft: '0 0 30px rgba(255,255,255,0.1)',
        borderGlow: '0 0 12px rgba(255,255,255,0.3)',
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
    },
  },
  plugins: [],
}

