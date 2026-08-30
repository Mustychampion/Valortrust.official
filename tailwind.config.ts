import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          900: '#0047AB',
          950: '#002B66', // For footer
        },
        yellow: {
          500: '#FFD700',
          600: '#E6C200',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
