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
  ButtonGroup,
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
import WPShortCode from './channels/WPShortCode'
import Calendly from './channels/Calendly'
import DocTutorials from '@components/global/DocTutorials'

const renderLink = (channelName: string) => {
  switch (channelName) {
    case 'custom-channel':
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=J3Eykpv3HeE&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=28" />
      )
    case 'custom-iframe':
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=llHYHzUZXnY&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=21" />
      )
    case 'call':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=vOnLBrrV160&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=12"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/call/"
        />
      )
    case 'custom-form':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=ReVUlPqT_1c&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=19"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/custom-form/"
        />
      )
    case 'discord':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=QoObRkkkH4E&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=6"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/discord/"
        />
      )
    case 'faq':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=KOiZzurMsTw&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=10"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/faq/"
        />
      )
    case 'google-map':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=jwR9Wrt8Cbw&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=9"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/google-map/"
        />
      )
    case 'instagram':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=H0hNuM9Aguo&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=12"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/instagram/"
        />
      )
    case 'knowledge-base':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=J1sEym-nQl0&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=19"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/knowledge-base/"
        />
      )
    case 'line':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=jz6KJXdk9kc&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=4"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/line/"
        />
      )
    case 'linkedin':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=OYq4e1M9sMU&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=15"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/linkedin/"
        />
      )
    case 'messenger':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=atVwkzFNnmM&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=1"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/messenger/"
        />
      )
    case 'pinterest':
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=jD76l_0jJIA&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=27" />
      )
    case 'skype':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=c5b3YEtJM9A&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=2"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/skype/"
        />
      )
    case 'signal':
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=tNiqiylU_Zw&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=26" />
      )
    case 'slack':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=ev5id6N1eVA&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=17"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/slack/"
        />
      )
    case 'sms':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=yjGOqcmfIhI&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=22"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/sms/"
        />
      )
    case 'snapchat':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=RlJs4BZDXHs&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=20"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/snapchat/"
        />
      )
    case 'tawk':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=MjRePkAati0&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=8"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/tawk/"
        />
      )
    case 'telegram':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=0fzK7He51_4&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=7"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/telegram/"
        />
      )
    case 'tiktok':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=Vyvu_JJKoOo&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=13"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/tiktok/"
        />
      )
    case 'twitter':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=c5b3YEtJM9A&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=2"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/twitter/"
        />
      )
    case 'viber':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=NDdqhDuMqUI&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=14"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/viber/"
        />
      )
    case 'waze':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=ocxUI_Zsd7I&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=23"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/waze/"
        />
      )
    case 'wechat':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=Y_U4dj3bwfQ&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=5"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/wechat/"
        />
      )
    case 'whatsapp':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=KFUa8jTvgkc&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=3"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/whatsapp/"
        />
      )
    case 'woocommerce':
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=oymiguCozg8&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=25" />
      )

    case 'wp-search':
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=HRaoM3sDrKc&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=16" />
      )
    case 'youtube':
      return (
        <DocTutorials
          tutorial="https://www.youtube.com/watch?v=YYQvO8gVols&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=24"
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/youtube/"
        />
      )

    default:
      return null
  }
}

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
      // case 'wp-shortcode':
      //   return <WPShortCode />
      case 'calendly':
        return <Calendly />
      default:
        return null
    }
  }

  return (
    <VStack alignItems="flex-start" spacing="6">
      <ButtonGroup alignItems="center">{renderLink(flow.channel_name.toLowerCase())}</ButtonGroup>

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
