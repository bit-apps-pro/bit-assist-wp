import config from '@config/config'
const imagePath = `${config.ROOT_URL}/img/channel`

import call from '@resource/img/channel/call.svg'
import customForm from '@resource/img/channel/custom-form.svg'
import discord from '@resource/img/channel/discord.svg'
import faq from '@resource/img/channel/faq.svg'
import googleMap from '@resource/img/channel/google-map.svg'
import instagram from '@resource/img/channel/instagram.svg'
import knowledgeBase from '@resource/img/channel/knowledge-base.svg'
import line from '@resource/img/channel/line.svg'
import linkedin from '@resource/img/channel/linkedin.svg'
import messenger from '@resource/img/channel/messenger.svg'
import skype from '@resource/img/channel/skype.svg'
import slack from '@resource/img/channel/slack.svg'
import sms from '@resource/img/channel/sms.svg'
import snapchat from '@resource/img/channel/snapchat.svg'
import tawk from '@resource/img/channel/tawk.svg'
import telegram from '@resource/img/channel/telegram.svg'
import tiktok from '@resource/img/channel/tiktok.svg'
import twitter from '@resource/img/channel/twitter.svg'
import viber from '@resource/img/channel/viber.svg'
import wechat from '@resource/img/channel/wechat.svg'
import whatsapp from '@resource/img/channel/whatsapp.svg'
import youtube from '@resource/img/channel/youtube.svg'

function getChannelIcon(urlImage: string, importImage: string) {
  return import.meta.env.MODE === 'development' ? `${imagePath}/frontend/src/resource/img/channel/${urlImage}` : importImage
}

const channelList = [
  {
    name: 'Call',
    icon: getChannelIcon('call.svg', call),
  },
  {
    name: 'Custom-Form',
    icon: getChannelIcon('custom-form.svg', customForm),
  },
  {
    name: 'Discord',
    icon: getChannelIcon('discord.svg', discord),
  },
  {
    name: 'FAQ',
    icon: getChannelIcon('faq.svg', faq),
  },
  {
    name: 'Google-Map',
    icon: getChannelIcon('google-map.svg', googleMap),
  },
  {
    name: 'Instagram',
    icon: getChannelIcon('instagram.svg', instagram),
  },
  {
    name: 'Knowledge-Base',
    icon: getChannelIcon('knowledge-base.svg', knowledgeBase),
  },
  {
    name: 'Line',
    icon: getChannelIcon('line.svg', line),
  },
  {
    name: 'Linkedin',
    icon: getChannelIcon('linkedin.svg', linkedin),
  },
  {
    name: 'Messenger',
    icon: getChannelIcon('messenger.svg', messenger),
  },
  {
    name: 'Skype',
    icon: getChannelIcon('skype.svg', skype),
  },
  {
    name: 'Slack',
    icon: getChannelIcon('slack.svg', slack),
  },
  {
    name: 'SMS',
    icon: getChannelIcon('sms.svg', sms),
  },
  {
    name: 'Snapchat',
    icon: getChannelIcon('snapchat.svg', snapchat),
  },
  {
    name: 'Tawk',
    icon: getChannelIcon('tawk.svg', tawk),
  },
  {
    name: 'Telegram',
    icon: getChannelIcon('telegram.svg', telegram),
  },
  {
    name: 'TikTok',
    icon: getChannelIcon('tiktok.svg', tiktok),
  },
  {
    name: 'Twitter',
    icon: getChannelIcon('twitter.svg', twitter),
  },
  {
    name: 'Viber',
    icon: getChannelIcon('viber.svg', viber),
  },
  {
    name: 'WeChat',
    icon: getChannelIcon('wechat.svg', wechat),
  },
  {
    name: 'Whatsapp',
    icon: getChannelIcon('whatsapp.svg', whatsapp),
  },
  {
    name: 'Youtube',
    icon: getChannelIcon('youtube.svg', youtube),
  },
]

export default channelList
