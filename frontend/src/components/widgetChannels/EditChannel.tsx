import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Spinner, Center } from '@chakra-ui/react'
import ChannelSettings from '@components/widgetChannels/ChannelSettings'
import { editWidgetChannelIdAtom, flowAtom, resetFlowAtom } from '@globalStates/atoms'
import useUpdateWidgetChannel from '@hooks/mutations/widgetChannel/useUpdateWidgetChannel'
import useFetchWidgetChannel from '@hooks/queries/widgetChannel/useFetchWidgetChannel'
import useToaster from '@hooks/useToaster'
import { widgetChannelValidate } from '@utils/validation'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'
import UpdateButton from './UpdateButton'

interface EditChannelProps {
  isOpen: boolean
  onClose: () => void
}

function EditChannel({ isOpen, onClose }: EditChannelProps) {
  const [flow, setFlow] = useAtom(flowAtom)
  const [, resetFlow] = useAtom(resetFlowAtom)
  const [editWidgetChannelId] = useAtom(editWidgetChannelIdAtom)
  const resetEditWidgetChannelId = useResetAtom(editWidgetChannelIdAtom)
  const { widgetChannel, isWidgetChannelFetching } = useFetchWidgetChannel()
  const { updateWidgetChannel, isWidgetChannelUpdating } = useUpdateWidgetChannel()
  const toaster = useToaster()

  const onModalClose = () => {
    onClose()
    resetFlow()
    resetEditWidgetChannelId()
  }

  useEffect(() => {
    if (!widgetChannel) return
    setFlow({
      step: 1,
      widget_id: widgetChannel.widget_id,
      channel_name: widgetChannel.channel_name,
      config: widgetChannel.config,
      sequence: widgetChannel?.sequence,
    })
  }, [widgetChannel])

  const editFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toaster('error', validated.error || 'Error')
      return
    }

    const { status, data } = await updateWidgetChannel(flow, editWidgetChannelId)
    toaster(status, data)
    if (status === 'success') onModalClose()
  }

  return (
    <Modal scrollBehavior="inside" size="3xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onModalClose} trapFocus={false}>
      <ModalOverlay />
      <ModalContent pb="4">
        <ModalHeader>Edit Channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {(isWidgetChannelFetching) && (
            <Center>
              <Spinner />
            </Center>
          )}
          {!isWidgetChannelFetching && (
            <form onSubmit={editFormSubmit}>
              <ChannelSettings />
              <UpdateButton isUpdating={isWidgetChannelUpdating} />
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditChannel
