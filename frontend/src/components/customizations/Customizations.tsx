import { Stack } from '@chakra-ui/react'
import WidgetIcons from '@components/customizations/WidgetIcons'
import WidgetColor from '@components/customizations/WidgetColor'
import WidgetName from '@components/customizations/WidgetName'
import WidgetSize from '@components/customizations/WidgetSize'
import WidgetShape from '@components/customizations/WidgetShape'
import CustomCSS from '@components/customizations/CustomCSS'
import ProWrapper from '@components/global/ProWrapper'
import WidgetPositions from './WidgetPositions'

function Customizations() {
  return (
    <Stack gap={[5, 6]}>
      <WidgetName />
      <WidgetColor />
      <WidgetIcons />
      <WidgetPositions />
      <WidgetSize />
      <WidgetShape />
      <ProWrapper>
        <CustomCSS />
      </ProWrapper>
    </Stack>
  )
}

export default Customizations
