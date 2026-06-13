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
        'bg-deep': '#0A2E26',
        'bg-card': '#103D32',
        'bg-elevated': '#1A5546',
        'gold': '#D4AF37',
        'gold-bright': '#F4D03F',
        'gold-dim': '#9C7F25',
        'text-primary': '#FAF7F0',
        'text-secondary': '#C8C2B0',
        'text-muted': '#8B8676',
        'accent-next': '#4ADE80',
        'accent-warning': '#FB923C',
      },
      fontFamily: {
        'amiri': ['Amiri', 'serif'],
        'cairo': ['Cairo', 'sans-serif'],
        'reem': ['Reem Kufi', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'adhan-pulse': 'adhanPulse 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212, 175, 55, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        adhanPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
