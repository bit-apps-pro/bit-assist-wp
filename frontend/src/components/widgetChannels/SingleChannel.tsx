/* eslint-disable camelcase */
import { Box, GridItem, Image, Text } from '@chakra-ui/react'
import config from '@config/config'
import { flowAtom } from '@globalStates/atoms'
import { type Channel } from '@globalStates/Interfaces'
import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'

function SingleChannel({ channel }: { channel: Channel }) {
  const { widgetId } = useParams()
  const [, setFlow] = useAtom(flowAtom)

  const onSelectChannel = (channel_name: string) => {
    setFlow(prev => ({
      ...prev,
      channel_name,
      config: {
        channel_show_on: ['desktop', 'mobile'],
        f_fields: channel_name === 'WooCommerce' ? ['number'] : [],
        open_window_action: '_blank',
        order_details:
          channel_name === 'WooCommerce'
            ? ['shipping_status', 'total_items', 'total_amount', 'billing_name', 'shipping_name']
            : [],
        title: channel_name.replaceAll('-', ' ')
      },
      step: 2,
      widget_id: widgetId
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
    'Intercom',
    'Tidio'
  ]

  return (
    <GridItem
      _focusVisible={{ boxShadow: 'outline' }}
      _hover={{ shadow: 'lg' }}
      borderWidth={1}
      cursor="pointer"
      onClick={() => onSelectChannel(channel.name)}
      onKeyDown={e => {
        if (e.key === 'Enter') onSelectChannel(channel.name)
      }}
      outline="none"
      position="relative"
      px="1"
      py="2.5"
      rounded="md"
      tabIndex={0}
      textAlign="center"
      transition="250ms"
    >
      {!config.IS_PRO && proChannels.includes(channel.name) && (
        <Box
          background="#00ff9c"
          borderRadius="1rem"
          color="#000"
          fontSize="xs"
          fontWeight="semibold"
          minWidth="20px"
          mr="1"
          mt="1"
          position="absolute"
          px="1"
          right="0"
          textAlign="center"
          top="0"
        >
          Pro
        </Box>
      )}

      <>
        <Image alt={channel.name} h="10" mx="auto" src={channel.icon} w="10" />
        <Text lineHeight="1" marginTop="2">
          {channel.name.replaceAll('-', ' ')}
        </Text>
      </>
    </GridItem>
  )
}

export default SingleChannel
