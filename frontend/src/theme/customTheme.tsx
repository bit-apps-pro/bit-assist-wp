import { extendTheme } from '@chakra-ui/react'
import { modalTheme } from './modalTheme'


const fonts = {
  heading: 'Outfit, sans-serif',
  body: 'Outfit, sans-serif',
  mono: 'Menlo, monospace',
}

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const customTheme = extendTheme({
  semanticTokens: {
    radii: {
      none: '0',
      sm: '0.375rem',
      base: '0.75rem',
      md: '0.75rem',
      lg: '0.9375rem',
      xl: '1.125rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '999px',
    },
  },
  shadows: {
    outline: '0 0 0 3px #D6BCFA',
    // outline: '0 0 0 3px #9AE6B4',
  },
  fonts,
  breakpoints,
  components: { Modal: modalTheme },
  // colors: {
  //   purple: {
  //     50: '#F0FFF4',
  //     100: '#C6F6D5',
  //     200: '#9AE6B4',
  //     300: '#68D391',
  //     400: '#68D391',
  //     500: '#68D391',
  //     600: '#48BB78',
  //     700: '#48BB78',
  //     800: '#38A169',
  //     900: '#38A169',
  //   },
  // }
})

export default customTheme
