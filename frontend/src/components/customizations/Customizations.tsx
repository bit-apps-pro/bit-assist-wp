import { Stack } from '@chakra-ui/react'
import CustomCSS from '@components/customizations/CustomCSS'
import WidgetColor from '@components/customizations/WidgetColor'
import WidgetCredit from '@components/customizations/WidgetCredit'
import WidgetIcons from '@components/customizations/WidgetIcons'
import WidgetName from '@components/customizations/WidgetName'
import WidgetPositions from '@components/customizations/WidgetPositions'
import WidgetShape from '@components/customizations/WidgetShape'
import { WidgetShowOn } from '@components/customizations/WidgetShowOn'
import WidgetSize from '@components/customizations/WidgetSize'

import { WidgetStyle } from './WidgetStyle'

function Customizations() {
  return (
    <Stack gap={[5, 6]}>
      <WidgetName />
      <WidgetStyle />
      <WidgetColor />
      <WidgetIcons />
      <WidgetPositions />
      <WidgetSize />
      <WidgetShape />
      <CustomCSS />
      <WidgetShowOn />
      <WidgetCredit />
    </Stack>
  )
}

export default Customizations
