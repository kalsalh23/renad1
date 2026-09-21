/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#4A1F52',
          dark: '#38173F',
          light: '#6D3B75',
          soft: '#F1E7F3',
        },
        lilac: {
          DEFAULT: '#F6EEF7',
          dark: '#EBDCEF',
        },
        chip: '#F3E9F5',
        ink: '#33203A',
        smoke: '#7E6E85',
        star: '#F2B01E',
        rose: '#F43F5E',
        mint: '#22C55E',
      },
      fontFamily: {
        sans: ['Cairo', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.22,.61,.36,1) both',
        'fade-in': 'fade-in .4s ease both',
        shimmer: 'shimmer 1.6s linear infinite',
        pop: 'pop .4s ease',
      },
    },
  },
  plugins: [],
}
