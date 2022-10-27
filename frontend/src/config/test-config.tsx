/* eslint-disable import/no-extraneous-dependencies */
import { render, queries } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()
const customRender = (ui: React.ReactNode, options: any) => render(
  <QueryClientProvider client={queryClient}>
    {ui}
  </QueryClientProvider>,
  { ...options },
)

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
