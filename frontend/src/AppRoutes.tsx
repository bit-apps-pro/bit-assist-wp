import { Route, Routes } from 'react-router-dom'
import loadable from '@loadable/component'
import Layout from '@pages/Layout'

const Widgets = loadable(() => import('@pages/widgets'), { fallback: <div>Loading...</div> })
const WidgetDetails = loadable(() => import('@pages/widgetDetails'), { fallback: <div>Loading...</div> })
const Responses = loadable(() => import('@pages/responses'), { fallback: <div>Loading...</div> })
const Error404 = loadable(() => import('@pages/Error404'), { fallback: <div>Loading...</div> })

export default function AppRoutes() {
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
