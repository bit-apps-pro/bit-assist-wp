import { Stack } from '@chakra-ui/react'
import WidgetIcons from '@components/customizations/WidgetIcons'
import WidgetPositions from './WidgetPositions'
import WidgetColor from '@components/customizations/WidgetColor'
import WidgetName from '@components/customizations/WidgetName'
import WidgetSize from '@components/customizations/WidgetSize'
import WidgetShape from '@components/customizations/WidgetShape'
import CustomCSS from '@components/customizations/CustomCSS'

const Customizations = () => {
  return (
    <Stack gap={[5, 10]}>
      <WidgetName />
      <WidgetColor />
      <WidgetIcons />
      <WidgetPositions />
      <WidgetSize />
      <WidgetShape />
      <CustomCSS />
    </Stack>
  )
}

export default Customizations
