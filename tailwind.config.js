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
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        ayurveda: {
          vata: '#8B5CF6',
          pitta: '#F59E0B',
          kapha: '#10B981'
        }
      }
    },
  },
  plugins: [],
}