/* eslint-disable camelcase */
import { GridItem, Image, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { Channel } from '@globalStates/Interfaces'
import { useAtom } from 'jotai'
import { flow } from 'lodash'
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
        order_details:
          channel_name === 'WooCommerce'
            ? ['shipping_status', 'total_items', 'total_amount', 'billing_name', 'shipping_name']
            : [],
        f_fields: channel_name === 'WooCommerce' ? ['number'] : [],
      },
    }))
  }

  return (
    <GridItem
      py="2.5"
      px="1"
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
      <>
        <Image src={channel.icon} alt={channel.name} w="10" h="10" mx="auto" />
        <Text marginTop="2" lineHeight="1">
          {channel.name.replace(/-/g, ' ')}
        </Text>
      </>
    </GridItem>
  )
}

export default SingleChannel
