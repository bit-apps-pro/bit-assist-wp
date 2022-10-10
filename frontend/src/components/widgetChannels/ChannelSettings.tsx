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
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

import SaveButton from '@components/widgetChannels/SaveButton'
import Whatsapp from '@components/widgetChannels/channels/Whatsapp'
import Messenger from '@components/widgetChannels/channels/Messenger'
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
import UpdateButton from '@components/widgetChannels/UpdateButton'
import KnowledgeBase from '@components/widgetChannels/channels/KnowledgeBase'
import Tawk from '@components/widgetChannels/channels/Tawk'

const ChannelSettings = ({ edit = false, ...props }) => {
  const [flow, setFlow] = useAtom(flowAtom)

  const handleChanges = (value: string | number | boolean | (string | number)[], key: string) => {
    setFlow((prev) => {
      prev.config[key] = value
    })
  }

  return (
    <>
      <VStack alignItems="flex-start" spacing="4">
        <FormControl isRequired>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" value={flow.config.title} onChange={(e) => handleChanges(e.target.value, 'title')} />
          <FormHelperText>Descriptive text for visitors.</FormHelperText>
        </FormControl>

        {flow.channel_name?.toLowerCase() === 'tawk' && <Tawk />}
        {flow.channel_name?.toLowerCase() === 'knowledge-base' && <KnowledgeBase />}
        {flow.channel_name?.toLowerCase() === 'faq' && <FAQ />}
        {flow.channel_name?.toLowerCase() === 'custom-form' && <CustomForm />}
        {flow.channel_name?.toLowerCase() === 'discord' && <Discord />}
        {flow.channel_name?.toLowerCase() === 'line' && <Line />}
        {flow.channel_name?.toLowerCase() === 'snapchat' && <Snapchat />}
        {flow.channel_name?.toLowerCase() === 'viber' && <Viber />}
        {flow.channel_name?.toLowerCase() === 'wechat' && <WeChat />}
        {flow.channel_name?.toLowerCase() === 'sms' && <SMS />}
        {flow.channel_name?.toLowerCase() === 'linkedin' && <Linkedin />}
        {flow.channel_name?.toLowerCase() === 'tiktok' && <TikTok />}
        {flow.channel_name?.toLowerCase() === 'google-map' && <GoogleMap />}
        {flow.channel_name?.toLowerCase() === 'slack' && <Slack />}
        {flow.channel_name?.toLowerCase() === 'youtube' && <Youtube />}
        {flow.channel_name?.toLowerCase() === 'call' && <Call />}
        {flow.channel_name?.toLowerCase() === 'skype' && <Skype />}
        {flow.channel_name?.toLowerCase() === 'whatsapp' && <Whatsapp />}
        {flow.channel_name?.toLowerCase() === 'messenger' && <Messenger />}
        {flow.channel_name?.toLowerCase() === 'twitter' && <Twitter />}
        {flow.channel_name?.toLowerCase() === 'instagram' && <Instagram />}
        {flow.channel_name?.toLowerCase() === 'telegram' && <Telegram />}

        <FormControl>
          <FormLabel htmlFor="hide_after_office_hours" display={'flex'} alignItems="center">
            Hide after office hours
            <Switch
              ml="2"
              id="hide_after_office_hours"
              colorScheme="purple"
              aria-label="hide after office hours"
              isChecked={flow.config?.hide_after_office_hours || false}
              onChange={(e) => handleChanges(e.target.checked, 'hide_after_office_hours')}
            />
          </FormLabel>
          <FormHelperText>Hide this channel after office time.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Channel show on</FormLabel>
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

      {edit ? <UpdateButton closeModal={props.closeModal} /> : <SaveButton />}
    </>
  )
}

export default ChannelSettings
