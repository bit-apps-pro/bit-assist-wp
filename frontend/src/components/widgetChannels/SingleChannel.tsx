/* eslint-disable camelcase */
import { Box, GridItem, Image, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { Channel } from '@globalStates/Interfaces'
import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import config from '@config/config'

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

  const proChannels = [
    'FAQ',
    'Knowledge-Base',
    'WooCommerce',
    'WP-Search',
    'Custom-Iframe',
    'Crisp',
    'Tawk',
    'Live-Chat-Messenger',
    'Intercom',
    'Tidio',
  ]

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
      position="relative"
    >
      {proChannels.includes(channel.name) && (
        <Box
          background="#00ff9c"
          borderRadius="1rem"
          position="absolute"
          top="0"
          right="0"
          fontWeight="semibold"
          fontSize="xs"
          color="#000"
          px="1"
          mt="1"
          mr="1"
          minWidth="20px"
          textAlign="center"
        >
          Pro
        </Box>
      )}
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
