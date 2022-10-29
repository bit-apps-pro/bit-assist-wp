import { Box } from '@chakra-ui/react'
import ProModal from '@components/global/ProModal'
import AddChannel from '@components/widgetChannels/AddChannel'
import WidgetChannelsList from '@components/widgetChannels/WidgetChannelsList'
import { widgetChannelCountAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { HiPlus } from 'react-icons/hi'

function Channels() {
  const [widgetChannelCount] = useAtom(widgetChannelCountAtom)

  return (
    <Box>
      {widgetChannelCount < 2 ? <AddChannel /> : <ProModal type="channel" number="2" text="Add Channel" icon={<HiPlus />} />}
      <WidgetChannelsList />
    </Box>
  )
}

export default Channels
