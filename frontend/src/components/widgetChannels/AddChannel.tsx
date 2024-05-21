import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  HStack,
  Box,
  Link,
  ButtonGroup,
} from '@chakra-ui/react'
import ChannelSelect from '@components/widgetChannels/ChannelSelect'
import ChannelSettings from '@components/widgetChannels/ChannelSettings'
import { useAtom } from 'jotai'
import { flowAtom, resetFlowAtom } from '@globalStates/atoms'
import { HiPlus } from 'react-icons/hi'
import { MdArrowBackIosNew } from 'react-icons/md'
import useToaster from '@hooks/useToaster'
import useCreateWidgetChannel from '@hooks/mutations/widgetChannel/useCreateWidgetChannel'
import { widgetChannelValidate } from '@utils/validation'
import config from '@config/config'
import ProWrapper from '@components/global/ProWrapper'
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

function AddChannel() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [flow] = useAtom(flowAtom)
  const [, resetFlow] = useAtom(resetFlowAtom)
  const toaster = useToaster()
  const { createWidgetChannel, isWidgetChannelCreating } = useCreateWidgetChannel()

  const onModalClose = () => {
    onClose()
    resetFlow('')
  }

  const saveFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toaster('error', validated.error || 'Error')
      return
    }

    const { status, data } = await createWidgetChannel(flow)
    toaster(status, data)
    if (status === 'success') onModalClose()
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
    'Tidio',
  ]

  return (
    <>
      <Button mb="4" mr="2" variant="outline" colorScheme="gray" leftIcon={<HiPlus />} onClick={onOpen}>
        Add Channel
      </Button>

      <Modal
        trapFocus={false}
        scrollBehavior="inside"
        size="3xl"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onModalClose}
      >
        <ModalOverlay />
        <ModalContent pb="4">
          <ModalHeader mr="6" pb="0">
            <HStack justifyContent="space-between">
              <HStack>
                {flow.step > 1 && (
                  <Button p="1" size="sm" variant="ghost" onClick={resetFlow}>
                    <MdArrowBackIosNew size="1rem" aria-label="back button" />
                  </Button>
                )}
                {flow.channel_name.toLowerCase() === 'live-chat-messenger' ? (
                  <Text>Facebook Chat Plugin Disabled!</Text>
                ) : (
                  <Text>Create New Channel</Text>
                )}

                <ButtonGroup alignItems="center">{renderLink(flow.channel_name.toLowerCase())}</ButtonGroup>
              </HStack>
              {flow.channel_name.toLowerCase() !== 'live-chat-messenger' && (
                <>
                  {flow.step === 2 && config.IS_PRO ? (
                    <Link href="https://bitapps.pro/bit-assist" target="_blank">
                      <Button
                        form="createNewChannelForm"
                        type="submit"
                        colorScheme="purple"
                        loadingText="Saving..."
                        spinnerPlacement="start"
                        isLoading={isWidgetChannelCreating}
                      >
                        Save
                      </Button>
                    </Link>
                  ) : (
                    flow.step === 2 &&
                    !proChannels.includes(flow?.channel_name) && (
                      <Button
                        form="createNewChannelForm"
                        type="submit"
                        colorScheme="purple"
                        loadingText="Saving..."
                        spinnerPlacement="start"
                        isLoading={isWidgetChannelCreating}
                      >
                        Save
                      </Button>
                    )
                  )}
                </>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {flow.step === 1 && <ChannelSelect />}
            {flow.step === 2 && (
              <>
                {!config.IS_PRO && proChannels.includes(flow?.channel_name) ? (
                  <ProWrapper>
                    <form onSubmit={saveFormSubmit} id="createNewChannelForm">
                      <ChannelSettings />
                    </form>
                  </ProWrapper>
                ) : (
                  <form onSubmit={saveFormSubmit} id="createNewChannelForm">
                    <ChannelSettings />
                  </form>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddChannel
