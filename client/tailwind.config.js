/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'authappfont': ['lobster'],
        'mono': [' Consolas, Courier New, monospace'],
      }
    },
  },
  plugins: [],
}