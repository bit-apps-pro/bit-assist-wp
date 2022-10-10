import { extendTheme } from '@chakra-ui/react'

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

const theme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: '#16161D',
        _dark: '#00ff33',
      },
      heroGradientStart: {
        default: '#7928CA',
        _dark: '#e3a7f9',
      },
      heroGradientEnd: {
        default: '#FF0080',
        _dark: '#fbec8f',
      },
    },
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
  },
  fonts,
  breakpoints,
})

export default theme
