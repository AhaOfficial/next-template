/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    container: {
      center: true
    },
    screens: {
      xs: { max: '639px' },
      // => @media (max-width: 639px) { ... }
      sm: '640px',
      // => @media (min-width: 640px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px'
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif']
      },
      colors: {
        primary: { default: '#1fc7c1', lighter: '#27ddd7', dark: '#1cb0ab' },
        black: '#111111',
        white: '#f0f0f0',
        gray: {
          100: '#bbbbbb',
          200: '#666666',
          300: '#333333',
          400: '#202020',
          500: '#1d1d1d'
        },
        warn: { default: '#FF5454' }
      },
      borderRadius: {
        sm: '3px',
        default: '5px',
        lg: '10px',
        xl: '25px'
      },
      inset: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        '1/2': '50%',
        full: '100%'
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }
    }
  },
  variants: ['responsive', 'hover'],
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        svg: {
          display: 'inline'
        },
        img: {
          display: 'inline'
        }
      })
    })
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.tsx',
      'components/**/*.jsx',
      'pages/**/*.tsx',
      'pages/**/*.jsx'
    ]
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true
  }
}
