/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        csb: {
          red: '#e30a17',
          blue: '#005f9e',
          light: '#f3f4f6',
          dark: '#1f2937'
        }
      }
    },
  },
  plugins: [],
}