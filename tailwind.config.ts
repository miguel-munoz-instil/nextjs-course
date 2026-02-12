import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        // Silksong-inspired color palette
        'thorny-purple': '#6a2c70',
        'silk-silver': '#c3c5c4',
        'needle-green': '#3a6351',
        'void-black': '#1b1b1e',
        'thorny-red': '#b71c1c',
        'silk-white': '#f5f5f5',
        // Replace blue with thorny red
        blue: {
          400: '#d32f2f',
          500: '#b71c1c',
          600: '#9a0007',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
