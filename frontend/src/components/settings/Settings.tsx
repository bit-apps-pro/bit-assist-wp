import { Stack } from '@chakra-ui/react'
import Trigger from '@components/settings/Trigger'
import PageFilters from '@components/settings/PageFilters'
import BusinessHours from '@components/settings/BusinessHours'
import WidgetBehavior from '@components/settings/WidgetBehavior'
import CallToAction from '@components/settings/CallToAction'
import FontFamily from '@components/settings/FontFamily'
import Responses from '@components/settings/Responses'

const Settings = () => {
  return (
    <Stack gap={[5, 10]}>
      <BusinessHours />
      <PageFilters />
      <Trigger />
      <CallToAction />
      <WidgetBehavior />
      {/* <FontFamily /> */}
      {/* <Responses /> */}
    </Stack>
  )
}

export default Settings