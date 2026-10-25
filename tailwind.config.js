/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['Fredoka', 'cursive', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
