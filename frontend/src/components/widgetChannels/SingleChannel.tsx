/* eslint-disable camelcase */
import { GridItem, Image, Text, VStack } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'

function SingleChannel({ channel }) {
  const { widgetId } = useParams()
  const [, setFlow] = useAtom(flowAtom)

  const onSelectChannel = (channel_id: string, channel_name: string) => {
    setFlow((prev) => ({
      ...prev,
      step: 2,
      widget_id: widgetId,
      channel_id,
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
      onClick={() => onSelectChannel(channel.id, channel.name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelectChannel(channel.id, channel.name)
      }}
    >
      {channel.icon ? (
        <Image src={channel.icon} alt={channel.name} w="10" h="10" mx="auto" />
      ) : (
        <VStack bg="gray.200" rounded="full" w="40px" h="40px" />
      )}
      <Text>{channel.name.replace(/-/g, ' ')}</Text>
    </GridItem>
  )
}

export default SingleChannel
