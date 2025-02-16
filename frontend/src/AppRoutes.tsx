import Layout from '@pages/Layout'
import Widgets from '@pages/Widgets'
import { Provider } from 'jotai'
import { lazy, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

const WidgetDetails = lazy(() => import('@pages/WidgetDetails'))
const Responses = lazy(() => import('@pages/Responses'))
const Error404 = lazy(() => import('@pages/Error404'))

export default function AppRoutes() {
  useEffect(removeUnwantedCSS, [])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<Widgets />} index />

          <Route
            element={
              <Provider>
                <WidgetDetails />
              </Provider>
            }
            path="/widgets/:widgetId"
          />

          <Route element={<Responses />} path="/responses/:widgetChannelId" />

          <Route element={<Error404 />} path="*" />
        </Route>
      </Routes>
    </HashRouter>
  )
}

function removeUnwantedCSS() {
  const conflictStyles = ['bootstrap']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any = document.styleSheets

  for (const style of styles) {
    if (style.href !== null) {
      const regex = new RegExp(conflictStyles.join('.*css|'), 'gi')
      if (style?.href.match(regex)) {
        style.disabled = true
      }
    }
  }
}
