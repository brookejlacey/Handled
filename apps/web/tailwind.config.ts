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
        brand: {
          green: '#2E6417',
          'green-dark': '#234F12',
          'green-light': '#4A8A2D',
          'green-lighter': '#E8F5E0',
          cream: '#FAF9F6',
          'cream-dark': '#F5F4F1',
        },
        // Dark mode surface colors
        dark: {
          bg: '#1A1A1A',
          'bg-secondary': '#242424',
          'bg-tertiary': '#2D2D2D',
          surface: '#333333',
          'surface-light': '#404040',
        },
        surface: {
          white: '#FFFFFF',
          cream: '#FAF9F6',
          muted: '#F5F4F1',
        },
        text: {
          primary: '#2D2D2D',
          secondary: '#6B6B6B',
          muted: '#9B9B9B',
          inverse: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E8E6E1',
          light: '#F0EEE9',
          dark: '#D4D1CA',
        },
        status: {
          success: '#2E6417',
          warning: '#D97706',
          error: '#DC2626',
          info: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow-green': '0 0 40px rgba(46, 100, 23, 0.3)',
        'glow-green-sm': '0 0 20px rgba(46, 100, 23, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #1A1A1A 0%, #242424 100%)',
        'gradient-card': 'linear-gradient(145deg, #2D2D2D 0%, #242424 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
