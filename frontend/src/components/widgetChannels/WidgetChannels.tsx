import { Box } from '@chakra-ui/react'
import AddChannel from '@components/widgetChannels/AddChannel'
import WidgetChannelsList from '@components/widgetChannels/WidgetChannelsList'

function Channels() {
  return (
    <Box>
      <AddChannel />
      <WidgetChannelsList />
    </Box>
  )
}

export default Channels
