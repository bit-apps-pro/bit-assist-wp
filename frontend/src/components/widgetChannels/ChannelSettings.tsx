import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Switch,
  VStack
} from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import Call from '@components/widgetChannels/channels/Call'
import CustomChannel from '@components/widgetChannels/channels/CustomChannel'
import CustomForm from '@components/widgetChannels/channels/CustomForm'
import CustomIframe from '@components/widgetChannels/channels/CustomIframe'
import Discord from '@components/widgetChannels/channels/Discord'
import FAQ from '@components/widgetChannels/channels/FAQ'
import CustomChannelIcon from '@components/widgetChannels/channels/Fields/CustomChannelIcon'
import GoogleMap from '@components/widgetChannels/channels/GoogleMap'
import Instagram from '@components/widgetChannels/channels/Instagram'
import KnowledgeBase from '@components/widgetChannels/channels/KnowledgeBase'
import Line from '@components/widgetChannels/channels/Line'
import Linkedin from '@components/widgetChannels/channels/Linkedin'
import Messenger from '@components/widgetChannels/channels/Messenger'
import Pinterest from '@components/widgetChannels/channels/Pinterest'
import Signal from '@components/widgetChannels/channels/Signal'
import Skype from '@components/widgetChannels/channels/Skype'
import Slack from '@components/widgetChannels/channels/Slack'
import SMS from '@components/widgetChannels/channels/SMS'
import Snapchat from '@components/widgetChannels/channels/Snapchat'
import Tawk from '@components/widgetChannels/channels/Tawk'
import Telegram from '@components/widgetChannels/channels/Telegram'
import TikTok from '@components/widgetChannels/channels/TikTok'
import Twitter from '@components/widgetChannels/channels/Twitter'
import Viber from '@components/widgetChannels/channels/Viber'
import Waze from '@components/widgetChannels/channels/Waze'
import WeChat from '@components/widgetChannels/channels/WeChat'
import Whatsapp from '@components/widgetChannels/channels/Whatsapp'
import WooCommerce from '@components/widgetChannels/channels/WooCommerce'
import WPSearch from '@components/widgetChannels/channels/WPSearch'
import Youtube from '@components/widgetChannels/channels/Youtube'
import config from '@config/config'
import { flowAtom } from '@globalStates/atoms'
import { type WidgetChannelConfig } from '@globalStates/Interfaces'
import { useAtom } from 'jotai'

import Calendly from './channels/Calendly'
import Crisp from './channels/Crisp'
import Intercom from './channels/Intercom'
import MessengerLive from './channels/MessengerLive'
import Tidio from './channels/Tidio'
import Tidycal from './channels/Tidycal'

const renderSelectedChannelSettings = (channelName: string) => {
  switch (channelName) {
    case 'calendly': {
      return <Calendly />
    }
    case 'call': {
      return <Call />
    }
    case 'crisp': {
      return <Crisp />
    }
    case 'custom-channel': {
      return <CustomChannel />
    }
    case 'custom-form': {
      return <CustomForm />
    }
    case 'custom-iframe': {
      return <CustomIframe />
    }
    case 'discord': {
      return <Discord />
    }
    case 'faq': {
      return <FAQ />
    }
    case 'google-map': {
      return <GoogleMap />
    }
    case 'instagram': {
      return <Instagram />
    }
    case 'intercom': {
      return <Intercom />
    }
    case 'knowledge-base': {
      return <KnowledgeBase />
    }
    case 'line': {
      return <Line />
    }
    case 'linkedin': {
      return <Linkedin />
    }
    case 'live-chat-messenger': {
      return <MessengerLive />
    }
    case 'messenger': {
      return <Messenger />
    }
    case 'pinterest': {
      return <Pinterest />
    }
    case 'signal': {
      return <Signal />
    }
    case 'skype': {
      return <Skype />
    }
    case 'slack': {
      return <Slack />
    }
    case 'sms': {
      return <SMS />
    }
    case 'snapchat': {
      return <Snapchat />
    }
    case 'tawk': {
      return <Tawk />
    }
    case 'telegram': {
      return <Telegram />
    }
    case 'tidio': {
      return <Tidio />
    }
    case 'tidycal': {
      return <Tidycal />
    }
    case 'tiktok': {
      return <TikTok />
    }
    case 'twitter': {
      return <Twitter />
    }
    case 'viber': {
      return <Viber />
    }
    case 'waze': {
      return <Waze />
    }
    case 'wechat': {
      return <WeChat />
    }
    case 'whatsapp': {
      return <Whatsapp />
    }
    case 'woocommerce': {
      return <WooCommerce />
    }
    case 'wp-search': {
      return <WPSearch />
    }
    case 'youtube': {
      return <Youtube />
    }
    default: {
      return
    }
  }
}

const PRO_CHANNELS = new Set([
  'Crisp',
  'Custom-Iframe',
  'FAQ',
  'Intercom',
  'Knowledge-Base',
  'Tawk',
  'Tidio',
  'WooCommerce',
  'WP-Search'
])

function ChannelSettings() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges: KeyedValueHandler<WidgetChannelConfig> = (key, value) => {
    setFlow(prev => {
      prev.config[key] = value
    })
  }

  const isProChannel = PRO_CHANNELS.has(flow.channel_name)

  if (flow.channel_name === 'Live-Chat-Messenger') {
    return <MessengerLive />
  }

  return (
    <>
      <VStack alignItems="flex-start" spacing="6">
        <>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input onChange={e => handleChanges('title', e.target.value)} value={flow.config.title} />
            <FormHelperText>Descriptive text for visitors.</FormHelperText>
          </FormControl>

          <CustomChannelIcon />

          {renderSelectedChannelSettings(flow.channel_name.toLowerCase())}

          <ProWrapper hide={isProChannel}>
            <FormControl>
              <Flex alignItems="center">
                <FormLabel mb="0">Hide after office hours</FormLabel>
                <Switch
                  aria-label="hide after office hours"
                  colorScheme="purple"
                  isChecked={flow.config?.hide_after_office_hours || false}
                  ml="2"
                  onChange={e => handleChanges('hide_after_office_hours', e.target.checked)}
                  tabIndex={config.IS_PRO ? 0 : -1}
                />
              </Flex>
              <FormHelperText>Hide this channel after office time.</FormHelperText>
            </FormControl>
          </ProWrapper>

          <FormControl>
            <FormLabel display="inline-block">Channel show on</FormLabel>
            <CheckboxGroup
              colorScheme="purple"
              onChange={val => handleChanges('channel_show_on', val)}
              value={flow.config?.channel_show_on ?? []}
            >
              <HStack spacing={4}>
                <Checkbox aria-label="show on desktop" size="lg" value="desktop">
                  Desktop
                </Checkbox>
                <Checkbox aria-label="show on mobile" size="lg" value="mobile">
                  Mobile
                </Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
        </>
      </VStack>
    </>
  )
}

export default ChannelSettings
