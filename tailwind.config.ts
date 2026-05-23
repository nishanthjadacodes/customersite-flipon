import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'prussian-blue': '#003153',
        'accent-yellow': '#FFD700',
        'accent-red': '#DC143C',
        'accent-blue': '#4169E1',
        'accent-gold': '#FFB300',
      },
    },
  },
  plugins: [],
};

export default config;
