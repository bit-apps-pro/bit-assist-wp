import { Box } from '@chakra-ui/react'
import ProModal from '@components/global/ProModal'
import AddChannel from '@components/widgetChannels/AddChannel'
import WidgetChannelsList from '@components/widgetChannels/WidgetChannelsList'
import { freeLimitsAtom, isProAtom, widgetChannelCountAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { HiPlus } from 'react-icons/hi'

function Channels() {
  const [widgetChannelCount] = useAtom(widgetChannelCountAtom)
  const [isPro] = useAtom(isProAtom)
  const [freeLimit] = useAtom(freeLimitsAtom)

  return (
    <Box>
      {(!isPro && widgetChannelCount >= freeLimit.channel)
        ? <ProModal type="channel" number={freeLimit.channel} text="Add Channel" icon={<HiPlus />} />
        : <AddChannel />}
      <WidgetChannelsList />
    </Box>
  )
}

export default Channels
