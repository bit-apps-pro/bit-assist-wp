import { Route, Routes } from 'react-router-dom'
import loadable from '@loadable/component'
import Layout from '@pages/Layout'
import { useEffect } from 'react'
import Loading from '@components/global/Loading'

const Widgets = loadable(() => import('@pages/Widgets'), { fallback: <Loading /> })
const WidgetDetails = loadable(() => import('@pages/WidgetDetails'), { fallback: <Loading /> })
const Responses = loadable(() => import('@pages/Responses'), { fallback: <Loading /> })
const Error404 = loadable(() => import('@pages/Error404'), { fallback: <Loading /> })

export default function AppRoutes() {
  useEffect(() => {
    removeUnwantedCSS()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Widgets />} />
        <Route path="/widgets/:widgetId" element={<WidgetDetails />} />
        <Route path="/responses/:widgetChannelId" element={<Responses />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
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
