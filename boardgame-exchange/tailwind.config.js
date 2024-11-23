/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fog-flow': 'fogFlow 20s linear infinite',
        'fog-rise': 'fogRise 10s ease-in-out infinite',
        'fog-swirl': 'fogSwirl 30s linear infinite',
      },
      keyframes: {
        fogFlow: {
          '0%': { transform: 'translateX(-50%) translateY(0)' },
          '100%': { transform: 'translateX(50%) translateY(0)' }
        },
        fogRise: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        fogSwirl: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}