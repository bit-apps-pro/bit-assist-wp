import Loading from '@components/global/Loading'
import Layout from '@pages/Layout'
import Widgets from '@pages/Widgets'
import { Provider } from 'jotai'
import { lazy, Suspense, useEffect } from 'react'
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
              <Suspense fallback={<Loading />}>
                <Provider>
                  <WidgetDetails />
                </Provider>
              </Suspense>
            }
            path="/widgets/:widgetId"
          />

          <Route
            element={
              <Suspense fallback={<Loading />}>
                <Responses />
              </Suspense>
            }
            path="/responses/:widgetChannelId"
          />

          <Route
            element={
              <Suspense fallback={<Loading />}>
                <Error404 />
              </Suspense>
            }
            path="*"
          />
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
