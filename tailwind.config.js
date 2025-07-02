import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/customer/index.html",
    "./apps/customer/src/**/*.{vue,js,ts,jsx,tsx}",
    "./apps/admin/index.html", 
    "./apps/admin/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
        }
      },
      fontFamily: {
        sans: [
          'Hiragino Sans',
          'Hiragino Kaku Gothic ProN',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [
    forms,
    aspectRatio,
    lineClamp,
  ],
}
