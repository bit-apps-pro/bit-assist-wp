import { Stack } from '@chakra-ui/react'
import Trigger from '@components/settings/Trigger'
import PageFilters from '@components/settings/PageFilters'
import BusinessHours from '@components/settings/BusinessHours'
import WidgetBehavior from '@components/settings/WidgetBehavior'
import CallToAction from '@components/settings/CallToAction'
import WidgetActiveBadge from '@components/settings/WidgetActiveBadge'
import AttentionAnimation from '@components/settings/AttentionAnimation'
// import FontFamily from '@components/settings/FontFamily'
// import Responses from '@components/settings/Responses'

function Settings() {
  return (
    <Stack gap={[5, 6]}>
      <BusinessHours />
      <WidgetActiveBadge />
      <PageFilters />
      <Trigger />
      <CallToAction />
      <WidgetBehavior />
      <AttentionAnimation />
      {/* <FontFamily /> */}
      {/* <Responses /> */}
    </Stack>
  )
}

export default Settings
