/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pista: {
          50: '#f4faf3',
          100: '#e3f2e1',
          200: '#c8e6c3',
          300: '#a3d49b',
          400: '#7cbf6f',
          500: '#5aa84c',
          600: '#448a3a',
          700: '#376e30',
          800: '#2f582a',
          900: '#284924',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}