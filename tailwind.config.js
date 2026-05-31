/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Domine', 'serif'],
      },
      colors: {
        brand: {
          50: '#FAECE7',
          100: '#F5C4B3',
          400: '#C4623A',
          600: '#993C1D',
          900: '#4A1B0C',
        },
        cream: '#FAF7F2',
        beige: {
          50: '#F5EFE3',
          100: '#EBE1CB',
          200: '#D9C9A6',
          400: '#A68F5C',
        },
        maroon: {
          100: '#F3E0E0',
          400: '#7A2E2E',
          600: '#5C1F1F',
          700: '#4A1818',
          800: '#421414',
          900: '#3D1212',
        },
      },
    },
  },
  plugins: [],
}
