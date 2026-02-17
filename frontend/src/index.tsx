import { ChakraProvider } from '@chakra-ui/react'
// eslint-disable-next-line no-restricted-imports -- setLocaleData required for i18n bootstrap
import { setLocaleData } from '@wordpress/i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'

import AppRoutes from './AppRoutes'

import '@resource/styles/variables.css'
import '@resource/styles/wp-css-reset.css'
import '@resource/styles/global.css'

import customTheme from './theme/customTheme'

// Sync WordPress-loaded translations into our bundled @wordpress/i18n instance.
// wp_set_script_translations() populates global wp.i18n; our bundle is a separate
// instance, so we copy the locale data over.
const wpLocaleData = typeof wp !== 'undefined' && wp?.i18n?.getLocaleData?.('bit-assist')
if (wpLocaleData && Object.keys(wpLocaleData).length > 1) {
  setLocaleData(wpLocaleData, 'bit-assist')
}

const queryClient = new QueryClient()
const rootElement = document.querySelector('#bit-apps-root')
if (rootElement) {
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={customTheme}>
          <AppRoutes />
        </ChakraProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
