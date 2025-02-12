import { extendTheme } from '@chakra-ui/react'

import { modalTheme } from './modalTheme'

const fonts = {
  body: 'Outfit, sans-serif',
  heading: 'Outfit, sans-serif',
  mono: 'Menlo, monospace'
}

const breakpoints = {
  lg: '64em',
  md: '52em',
  sm: '40em',
  xl: '80em'
}

const customTheme = extendTheme({
  breakpoints,
  components: { Modal: modalTheme },
  fonts,
  semanticTokens: {
    radii: {
      '2xl': '1rem',
      '3xl': '1.5rem',
      base: '0.75rem',
      full: '999px',
      lg: '0.9375rem',
      md: '0.75rem',
      none: '0',
      sm: '0.375rem',
      xl: '1.125rem'
    }
  },
  shadows: {
    outline: '0 0 0 3px #D6BCFA'
    // outline: '0 0 0 3px #9AE6B4',
  }
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
