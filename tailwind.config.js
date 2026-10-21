/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5FBF',
          dark: '#503477',
          light: '#A77FD3',
          soft: '#F6F0FC',
          muted: '#EAE1F5',
        },
        deepPurple: '#503477',
        lavender: {
          50: '#FAF6FE',
          100: '#F6F0FC',
          200: '#EDE3F7',
          300: '#DCBEEF',
          400: '#B684DD',
          500: '#8B5FBF',
          600: '#7346A8',
          700: '#5C338C',
          800: '#503477',
          900: '#351F52',
        },
        blush: {
          DEFAULT: '#F7DCE8',
          light: '#FDF4F8',
          dark: '#E7B6CE',
        },
        roseAccent: {
          DEFAULT: '#D95783',
          light: '#F8E6EE',
          dark: '#B93663',
        },
        cardBg: '#FFFFFF',
        mainText: '#29213A',
        subText: '#766C82',
        successState: {
          DEFAULT: '#36866A',
          bg: '#EAF5F1',
          border: '#B6E2D3',
        },
        warningState: {
          DEFAULT: '#D58A35',
          bg: '#FDF5EC',
          border: '#F6D9B4',
        },
        criticalState: {
          DEFAULT: '#D6455D',
          bg: '#FDECEF',
          border: '#F8BCC7',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(80, 52, 119, 0.05)',
        'soft': '0 4px 20px -2px rgba(80, 52, 119, 0.07)',
        'soft-md': '0 8px 25px -4px rgba(80, 52, 119, 0.10)',
        'soft-lg': '0 16px 36px -6px rgba(80, 52, 119, 0.12)',
        'floating': '0 20px 40px -10px rgba(139, 95, 191, 0.25)',
        'sos': '0 0 0 10px rgba(214, 69, 93, 0.2), 0 12px 30px rgba(214, 69, 93, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
