/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0F14',
        panel: '#101922',
        panel2: '#141F29',
        line: '#1E2C38',
        cyan: '#4FD1C5',
        cyanDim: '#2C6B67',
        amber: '#E8A94C',
        text: '#E7EDF0',
        muted: '#7C8A93',
        danger: '#E4574C',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
