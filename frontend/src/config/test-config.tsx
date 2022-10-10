/* eslint-disable import/no-extraneous-dependencies */
import { render, queries } from '@testing-library/react'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

const customRender = (ui: React.ReactNode, options: any) => render(
  /* @ts-ignore */
  <QueryClientProvider client={queryClient}>
    {/* @ts-ignore */}
    <RecoilRoot>
      {ui}
    </RecoilRoot>
  </QueryClientProvider>,
  { ...options },
)

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
