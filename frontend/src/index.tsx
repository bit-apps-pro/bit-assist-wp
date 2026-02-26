import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'

import AppRoutes from './AppRoutes'

import '@resource/styles/variables.css'
import '@resource/styles/wp-css-reset.css'
import '@resource/styles/global.css'

import customTheme from './theme/customTheme'

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
