import { Stack } from '@chakra-ui/react'
import WidgetIcons from '@components/customizations/WidgetIcons'
import WidgetColor from '@components/customizations/WidgetColor'
import WidgetName from '@components/customizations/WidgetName'
import WidgetSize from '@components/customizations/WidgetSize'
import WidgetShape from '@components/customizations/WidgetShape'
import CustomCSS from '@components/customizations/CustomCSS'
import WidgetPositions from '@components/customizations/WidgetPositions'
import WidgetCredit from '@components/customizations/WidgetCredit'
import { WidgetShowOn } from '@components/customizations/WidgetShowOn'
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
