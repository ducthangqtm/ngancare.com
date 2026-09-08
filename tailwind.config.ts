import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F9F3E8',
          200: '#F3E8D3',
          300: '#E8D4B0',
          400: '#DEC08A',
          500: '#D4A359', // Brand Gold
          600: '#C59247', // Hover Gold
          700: '#A47432',
          800: '#7F5724',
          900: '#543714',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FDFCF9',
          200: '#FAF6F0', // Brand Warm Cream
          300: '#F5EFE4',
          400: '#EDE4D3',
          500: '#DFD2BC',
        },
        charcoal: {
          800: '#3D3D3D',
          900: '#2D2D2D', // Brand Text
          950: '#1D1D1D',
        },
        emergency: {
          500: '#E04F38',
          600: '#C93B25',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'gold-soft': '0 4px 20px -2px rgba(212, 163, 89, 0.15)',
        'gold-lg': '0 10px 30px -4px rgba(212, 163, 89, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
};

export default config;
