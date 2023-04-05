/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./source/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,

      // Site colors
      mainBg: "#E3DDFF",
      otherBg: "#2B2644",
      darkText: '#191923',
      lightText: '#E3DDFF',
      linkHover: '#2B2644',
      inputOutline: '#4226ce',
      darkOverlay: '#00000026',
    },
    fontFamily: {
      "body": ["Poppins", "sans-serif"],
      "playfair": ["Playfair Display", "sans-serif"]
    },
    screens: {
      // => @media (min-width: 400px) { ... }
      'ssm': '400px',
      // => @media (min-width: 500px) { ... }
      'smm': '500px',
      // => @media (min-width: 640px) { ... }
      'sm': '640px',
      // => @media (min-width: 768px) { ... }
      'md': '768px',
      // => @media (min-width: 1024px) { ... }
      'lg': '1024px',
      // => @media (min-width: 1280px) { ... }
      'xl': '1280px',
      // => @media (min-width: 1536px) { ... }
      '2xl': '1536px',
    },
    extend: {
      animation: {
        opacity: 'opacity .5s ease-out 1',
      },
      keyframes: {
        opacity: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}