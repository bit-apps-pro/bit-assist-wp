import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Spinner, Center } from '@chakra-ui/react'
import ChannelSettings from '@components/widgetChannels/ChannelSettings'
import { editWidgetChannelIdAtom, flowAtom, resetFlowAtom } from '@globalStates/atoms'
import useFetchChannel from '@hooks/queries/channel/useFetchChannel'
import useFetchWidgetChannel from '@hooks/queries/widgetChannel/useFetchWidgetChannel'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'

function EditChannel({ isOpen, onClose }) {
  const [, setFlow] = useAtom(flowAtom)
  const [, resetFlow] = useAtom(resetFlowAtom)
  const resetEditWidgetChannelId = useResetAtom(editWidgetChannelIdAtom)
  const { widgetChannel, isWidgetChannelFetching } = useFetchWidgetChannel()
  const { channel, isChannelFetching } = useFetchChannel(widgetChannel?.channel_id)

  const onModalClose = () => {
    onClose()
    resetFlow()
    resetEditWidgetChannelId()
  }

  useEffect(() => {
    if (!widgetChannel || !channel) return

    setFlow({
      step: 1,
      widget_id: widgetChannel.widget_id,
      channel_id: widgetChannel.channel_id,
      channel_name: channel?.name,
      config: widgetChannel.config,
      sequence: widgetChannel?.sequence,
    })
  }, [widgetChannel, channel])

  return (
    <Modal scrollBehavior="inside" size="3xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onModalClose} trapFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="4">
          {(isWidgetChannelFetching || isChannelFetching) && (
            <Center>
              <Spinner />
            </Center>
          )}
          {!isWidgetChannelFetching && !isChannelFetching && <ChannelSettings edit closeModal={onModalClose} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditChannel
