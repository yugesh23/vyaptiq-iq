/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F7F3',
        navy: {
          900: '#14263A',
          800: '#1C3550',
          700: '#26486D',
          600: '#345D8C',
          50: '#F0F4F8',
        },
        teal: {
          brand: '#087E78',
          hover: '#066661',
          light: '#E6F4F3',
          dark: '#044C49',
        },
        amber: {
          flag: '#965600',
          bg: '#FEF7EC',
          border: '#E8B667',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
