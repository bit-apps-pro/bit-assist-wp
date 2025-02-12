import { Stack } from '@chakra-ui/react'
import AttentionAnimation from '@components/settings/AttentionAnimation'
import BusinessHours from '@components/settings/BusinessHours'
import CallToAction from '@components/settings/CallToAction'
import PageFilters from '@components/settings/PageFilters'
import Trigger from '@components/settings/Trigger'
import WidgetActiveBadge from '@components/settings/WidgetActiveBadge'
import WidgetBehavior from '@components/settings/WidgetBehavior'

import GoogleAnalytics from './GoogleAnalytics'
// import FontFamily from '@components/settings/FontFamily'
// import Responses from '@components/settings/Responses'

function Settings() {
  return (
    <Stack gap={[5, 6]}>
      <BusinessHours />
      <WidgetActiveBadge />
      <PageFilters />
      <Trigger />
      <GoogleAnalytics />
      <CallToAction />
      <WidgetBehavior />
      <AttentionAnimation />
      {/* <FontFamily /> */}
      {/* <Responses /> */}
    </Stack>
  )
}

export default Settings
