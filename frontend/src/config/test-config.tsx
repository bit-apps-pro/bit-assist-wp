import { render } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customRender = (ui: React.ReactNode, options: any) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>, { ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
