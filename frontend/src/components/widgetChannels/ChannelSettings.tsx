import {
  VStack,
  Input,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  CheckboxGroup,
  Checkbox,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

import Whatsapp from '@components/widgetChannels/channels/Whatsapp'
import Messenger from '@components/widgetChannels/channels/Messenger'
import Pinterest from '@components/widgetChannels/channels/Pinterest'
import Signal from '@components/widgetChannels/channels/Signal'
import Twitter from '@components/widgetChannels/channels/Twitter'
import Instagram from '@components/widgetChannels/channels/Instagram'
import Telegram from '@components/widgetChannels/channels/Telegram'
import Skype from '@components/widgetChannels/channels/Skype'
import Discord from '@components/widgetChannels/channels/Discord'
import Line from '@components/widgetChannels/channels/Line'
import Snapchat from '@components/widgetChannels/channels/Snapchat'
import Viber from '@components/widgetChannels/channels/Viber'
import WeChat from '@components/widgetChannels/channels/WeChat'
import SMS from '@components/widgetChannels/channels/SMS'
import Linkedin from '@components/widgetChannels/channels/Linkedin'
import TikTok from '@components/widgetChannels/channels/TikTok'
import GoogleMap from '@components/widgetChannels/channels/GoogleMap'
import Slack from '@components/widgetChannels/channels/Slack'
import Youtube from '@components/widgetChannels/channels/Youtube'
import Call from '@components/widgetChannels/channels/Call'
import FAQ from '@components/widgetChannels/channels/FAQ'
import CustomForm from '@components/widgetChannels/channels/CustomForm'
import KnowledgeBase from '@components/widgetChannels/channels/KnowledgeBase'
import Tawk from '@components/widgetChannels/channels/Tawk'
import Waze from '@components/widgetChannels/channels/Waze'
import CustomChannel from '@components/widgetChannels/channels/CustomChannel'
import CustomIframe from '@components/widgetChannels/channels/CustomIframe'
import config from '@config/config'
import ProWrapper from '@components/global/ProWrapper'
import CustomChannelIcon from '@components/widgetChannels/channels/Fields/CustomChannelIcon'
import WPSearch from '@components/widgetChannels/channels/WPSearch'
import WooCommerce from '@components/widgetChannels/channels/WooCommerce'

function ChannelSettings() {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean | (string | number)[], key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  const renderSelectedChannelSettings = (channelName: string) => {
    switch (channelName) {
      case 'wp-search':
        return <WPSearch />
      case 'custom-iframe':
        return <CustomIframe />
      case 'custom-channel':
        return <CustomChannel />
      case 'tawk':
        return <Tawk />
      case 'knowledge-base':
        return <KnowledgeBase />
      case 'faq':
        return <FAQ />
      case 'custom-form':
        return <CustomForm />
      case 'discord':
        return <Discord />
      case 'line':
        return <Line />
      case 'snapchat':
        return <Snapchat />
      case 'viber':
        return <Viber />
      case 'wechat':
        return <WeChat />
      case 'sms':
        return <SMS />
      case 'linkedin':
        return <Linkedin />
      case 'tiktok':
        return <TikTok />
      case 'google-map':
        return <GoogleMap />
      case 'waze':
        return <Waze />
      case 'slack':
        return <Slack />
      case 'youtube':
        return <Youtube />
      case 'call':
        return <Call />
      case 'skype':
        return <Skype />
      case 'signal':
        return <Signal />
      case 'whatsapp':
        return <Whatsapp />
      case 'messenger':
        return <Messenger />
      case 'pinterest':
        return <Pinterest />
      case 'twitter':
        return <Twitter />
      case 'instagram':
        return <Instagram />
      case 'telegram':
        return <Telegram />
      case 'woocommerce':
        return <WooCommerce />
      default:
        return null
    }
  }

  return (
    <VStack alignItems="flex-start" spacing="6">
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input value={flow.config.title} onChange={(e) => handleChanges(e.target.value, 'title')} />
        <FormHelperText>Descriptive text for visitors.</FormHelperText>
      </FormControl>

      <CustomChannelIcon />

      {renderSelectedChannelSettings(flow.channel_name.toLowerCase())}

      <ProWrapper>
        <FormControl>
          <Flex alignItems="center">
            <FormLabel mb="0">Hide after office hours</FormLabel>
            <Switch
              ml="2"
              colorScheme="purple"
              aria-label="hide after office hours"
              isChecked={flow.config?.hide_after_office_hours || false}
              onChange={(e) => handleChanges(e.target.checked, 'hide_after_office_hours')}
              tabIndex={config.IS_PRO ? 0 : -1}
            />
          </Flex>
          <FormHelperText>Hide this channel after office time.</FormHelperText>
        </FormControl>
      </ProWrapper>

      <FormControl>
        <FormLabel display="inline-block">Channel show on</FormLabel>
        <CheckboxGroup
          onChange={(val) => handleChanges(val, 'channel_show_on')}
          colorScheme="purple"
          value={flow.config?.channel_show_on ?? []}
        >
          <HStack spacing={4}>
            <Checkbox size="lg" value="desktop" aria-label="show on desktop">
              Desktop
            </Checkbox>
            <Checkbox size="lg" value="mobile" aria-label="show on mobile">
              Mobile
            </Checkbox>
          </HStack>
        </CheckboxGroup>
      </FormControl>
    </VStack>
  )
}

export default ChannelSettings
