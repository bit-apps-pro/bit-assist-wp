import {
  Button,
  ButtonGroup,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import DocTutorials from '@components/global/DocTutorials'
import ProWrapper from '@components/global/ProWrapper'
import ChannelSelect from '@components/widgetChannels/ChannelSelect'
import ChannelSettings from '@components/widgetChannels/ChannelSettings'
import config from '@config/config'
import { flowAtom, resetFlowAtom } from '@globalStates/atoms'
import useCreateWidgetChannel from '@hooks/mutations/widgetChannel/useCreateWidgetChannel'
import useToaster from '@hooks/useToaster'
import { widgetChannelValidate } from '@utils/validation'
import { useAtom } from 'jotai'
import { HiPlus } from 'react-icons/hi'
import { MdArrowBackIosNew } from 'react-icons/md'

const renderLink = (channelName: string) => {
  switch (channelName) {
    case 'call': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/call/"
          tutorial="https://www.youtube.com/watch?v=vOnLBrrV160&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=12"
        />
      )
    }
    case 'custom-channel': {
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=J3Eykpv3HeE&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=28" />
      )
    }
    case 'custom-form': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/custom-form/"
          tutorial="https://www.youtube.com/watch?v=ReVUlPqT_1c&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=19"
        />
      )
    }
    case 'custom-iframe': {
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=llHYHzUZXnY&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=21" />
      )
    }
    case 'discord': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/discord/"
          tutorial="https://www.youtube.com/watch?v=QoObRkkkH4E&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=6"
        />
      )
    }
    case 'faq': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/faq/"
          tutorial="https://www.youtube.com/watch?v=KOiZzurMsTw&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=10"
        />
      )
    }
    case 'google-map': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/google-map/"
          tutorial="https://www.youtube.com/watch?v=jwR9Wrt8Cbw&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=9"
        />
      )
    }
    case 'instagram': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/instagram/"
          tutorial="https://www.youtube.com/watch?v=H0hNuM9Aguo&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=12"
        />
      )
    }
    case 'knowledge-base': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/knowledge-base/"
          tutorial="https://www.youtube.com/watch?v=J1sEym-nQl0&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=19"
        />
      )
    }
    case 'line': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/line/"
          tutorial="https://www.youtube.com/watch?v=jz6KJXdk9kc&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=4"
        />
      )
    }
    case 'linkedin': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/linkedin/"
          tutorial="https://www.youtube.com/watch?v=OYq4e1M9sMU&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=15"
        />
      )
    }
    case 'messenger': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/messenger/"
          tutorial="https://www.youtube.com/watch?v=atVwkzFNnmM&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=1"
        />
      )
    }
    case 'pinterest': {
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=jD76l_0jJIA&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=27" />
      )
    }
    case 'signal': {
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=tNiqiylU_Zw&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=26" />
      )
    }
    case 'slack': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/slack/"
          tutorial="https://www.youtube.com/watch?v=ev5id6N1eVA&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=17"
        />
      )
    }
    case 'sms': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/sms/"
          tutorial="https://www.youtube.com/watch?v=yjGOqcmfIhI&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=22"
        />
      )
    }
    case 'snapchat': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/snapchat/"
          tutorial="https://www.youtube.com/watch?v=RlJs4BZDXHs&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=20"
        />
      )
    }
    case 'tawk': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/tawk/"
          tutorial="https://www.youtube.com/watch?v=MjRePkAati0&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=8"
        />
      )
    }
    case 'telegram': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/telegram/"
          tutorial="https://www.youtube.com/watch?v=0fzK7He51_4&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=7"
        />
      )
    }
    case 'tiktok': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/tiktok/"
          tutorial="https://www.youtube.com/watch?v=Vyvu_JJKoOo&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=13"
        />
      )
    }
    case 'twitter': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/twitter/"
          tutorial="https://www.youtube.com/watch?v=c5b3YEtJM9A&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=2"
        />
      )
    }
    case 'viber': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/viber/"
          tutorial="https://www.youtube.com/watch?v=NDdqhDuMqUI&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=14"
        />
      )
    }
    case 'waze': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/waze/"
          tutorial="https://www.youtube.com/watch?v=ocxUI_Zsd7I&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=23"
        />
      )
    }
    case 'wechat': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/wechat/"
          tutorial="https://www.youtube.com/watch?v=Y_U4dj3bwfQ&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=5"
        />
      )
    }
    case 'whatsapp': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/whatsapp/"
          tutorial="https://www.youtube.com/watch?v=KFUa8jTvgkc&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=3"
        />
      )
    }
    case 'woocommerce': {
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=oymiguCozg8&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=25" />
      )
    }

    case 'wp-search': {
      return (
        <DocTutorials tutorial="https://www.youtube.com/watch?v=HRaoM3sDrKc&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=16" />
      )
    }
    case 'youtube': {
      return (
        <DocTutorials
          docLink="https://bitapps.pro/docs/bit-assist/all-channels/youtube/"
          tutorial="https://www.youtube.com/watch?v=YYQvO8gVols&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=24"
        />
      )
    }

    default: {
      return
    }
  }
}

function AddChannel() {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [flow] = useAtom(flowAtom)
  const [, resetFlow] = useAtom(resetFlowAtom)
  const toaster = useToaster()
  const { createWidgetChannel, isWidgetChannelCreating } = useCreateWidgetChannel()

  const onModalClose = () => {
    onClose()
    resetFlow()
  }

  const saveFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toaster('error', validated.error || 'Error')
      return
    }

    const { data, status } = await createWidgetChannel(flow)
    toaster(status, data)
    if (status === 'success') onModalClose()
  }

  const proChannels = new Set([
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

  return (
    <>
      <Button
        colorScheme="purple"
        leftIcon={<HiPlus />}
        mb="4"
        mr="2"
        onClick={onOpen}
        variant="outline"
      >
        Add Channel
      </Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onModalClose}
        scrollBehavior="inside"
        size="3xl"
        trapFocus={false}
      >
        <ModalOverlay />
        <ModalContent pb="4">
          <ModalHeader mr="6" pb="0">
            <HStack justifyContent="space-between">
              <HStack>
                {flow.step > 1 && (
                  <Button onClick={resetFlow} p="1" size="sm" variant="ghost">
                    <MdArrowBackIosNew aria-label="back button" size="1rem" />
                  </Button>
                )}
                {flow.channel_name.toLowerCase() === 'live-chat-messenger' ? (
                  <Text>Facebook Chat Plugin Disabled!</Text>
                ) : (
                  <Text>Create New Channel</Text>
                )}

                <ButtonGroup alignItems="center">
                  {renderLink(flow.channel_name.toLowerCase())}
                </ButtonGroup>
              </HStack>
              {flow.channel_name.toLowerCase() !== 'live-chat-messenger' && (
                <>
                  {flow.step === 2 && config.IS_PRO ? (
                    <Link href="https://bitapps.pro/bit-assist" target="_blank">
                      <Button
                        colorScheme="purple"
                        form="createNewChannelForm"
                        isLoading={isWidgetChannelCreating}
                        loadingText="Saving..."
                        spinnerPlacement="start"
                        type="submit"
                      >
                        Save
                      </Button>
                    </Link>
                  ) : (
                    flow.step === 2 &&
                    !proChannels.has(flow?.channel_name) && (
                      <Button
                        colorScheme="purple"
                        form="createNewChannelForm"
                        isLoading={isWidgetChannelCreating}
                        loadingText="Saving..."
                        spinnerPlacement="start"
                        type="submit"
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
                {!config.IS_PRO && proChannels.has(flow?.channel_name) ? (
                  <ProWrapper>
                    <form id="createNewChannelForm" onSubmit={saveFormSubmit}>
                      <ChannelSettings />
                    </form>
                  </ProWrapper>
                ) : (
                  <form id="createNewChannelForm" onSubmit={saveFormSubmit}>
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
