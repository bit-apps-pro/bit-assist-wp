import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import config from '@config/config'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import AppRoutes from './AppRoutes'
import '@resource/styles/variables.css'
import '@resource/styles/wp-css-reset.css'
import '@resource/styles/utilities.sass'
import '@resource/styles/global.css'
import theme from './theme'

if (config.IS_DEV) window.appstate = {}

const queryClient = new QueryClient()
const elm = document.getElementById('bit-apps-root')
if (elm) {
  const root = createRoot(elm)

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
