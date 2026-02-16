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

// wp_set_script_translations sets locale data on the global wp.i18n.
// The bundled @wordpress/i18n is a separate instance, so bridge the data.
/* eslint-disable @typescript-eslint/no-explicit-any */
const globalLocaleData = (window as any).wp?.i18n?.getLocaleData?.('bit-assist')
if (globalLocaleData && Object.keys(globalLocaleData).length > 1) {
  setLocaleData(globalLocaleData, 'bit-assist')
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
