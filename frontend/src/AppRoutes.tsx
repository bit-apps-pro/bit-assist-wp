import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@pages/Layout'
import { useEffect, lazy, Suspense } from 'react'
import Loading from '@components/global/Loading'
import Widgets from '@pages/Widgets'
import { Provider } from 'jotai'

const WidgetDetails = lazy(() => import('@pages/WidgetDetails'))
const Responses = lazy(() => import('@pages/Responses'))
const Error404 = lazy(() => import('@pages/Error404'))

export default function AppRoutes() {
  useEffect(removeUnwantedCSS, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Widgets />} />

          <Route
            path="/widgets/:widgetId"
            element={
              <Suspense fallback={<Loading />}>
                <Provider>
                  <WidgetDetails />
                </Provider>
              </Suspense>
            }
          />

          <Route
            path="/responses/:widgetChannelId"
            element={
              <Suspense fallback={<Loading />}>
                <Responses />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={<Loading />}>
                <Error404 />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  )
}

function removeUnwantedCSS() {
  const conflictStyles = ['bootstrap']
  const styles: any = document.styleSheets

  for (let i = 0; i < styles.length; i += 1) {
    if (styles[i].href !== null) {
      const regex = new RegExp(conflictStyles.join('.*css|'), 'gi')
      if (styles[i]?.href.match(regex)) {
        styles[i].disabled = true
      }
    }
  }
}
