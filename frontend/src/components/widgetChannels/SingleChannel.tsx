/* eslint-disable camelcase */
import { GridItem, Image, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { Channel } from '@globalStates/Interfaces'
import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'

function SingleChannel({ channel }: { channel: Channel }) {
  const { widgetId } = useParams()
  const [, setFlow] = useAtom(flowAtom)

  const onSelectChannel = (channel_name: string) => {
    setFlow((prev) => ({
      ...prev,
      step: 2,
      widget_id: widgetId,
      channel_name,
      config: {
        title: channel_name.replace(/-/g, ' '),
        open_window_action: '_blank',
        channel_show_on: ['desktop', 'mobile'],
      },
    }))
  }

  return (
    <GridItem
      py="2"
      rounded="md"
      tabIndex={0}
      borderWidth={1}
      cursor="pointer"
      outline="none"
      transition="250ms"
      textAlign="center"
      _hover={{ shadow: 'lg' }}
      _focusVisible={{ boxShadow: 'outline' }}
      onClick={() => onSelectChannel(channel.name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelectChannel(channel.name)
      }}
    >
      {console.log(new URL('@resource/img/channel/call.svg', import.meta.url).href)}
      <Image src={channel.icon} alt={channel.name} w="10" h="10" mx="auto" />
      <Text marginTop="1">{channel.name.replace(/-/g, ' ')}</Text>
    </GridItem>
  )
}

export default SingleChannel
