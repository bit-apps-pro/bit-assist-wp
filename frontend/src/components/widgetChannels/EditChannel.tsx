import {
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text
} from '@chakra-ui/react'
import ChannelSettings from '@components/widgetChannels/ChannelSettings'
import { editWidgetChannelIdAtom, flowAtom, resetFlowAtom } from '@globalStates/atoms'
import useUpdateWidgetChannel from '@hooks/mutations/widgetChannel/useUpdateWidgetChannel'
import useFetchWidgetChannel from '@hooks/queries/widgetChannel/useFetchWidgetChannel'
import useToaster from '@hooks/useToaster'
import { widgetChannelValidate } from '@utils/validation'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'

interface EditChannelProps {
  isOpen: boolean
  onClose: () => void
}

function EditChannel({ isOpen, onClose }: EditChannelProps) {
  const [flow, setFlow] = useAtom(flowAtom)
  const [, resetFlow] = useAtom(resetFlowAtom)
  const [editWidgetChannelId] = useAtom(editWidgetChannelIdAtom)
  const resetEditWidgetChannelId = useResetAtom(editWidgetChannelIdAtom)
  const { isWidgetChannelFetching, widgetChannel } = useFetchWidgetChannel()
  const { isWidgetChannelUpdating, updateWidgetChannel } = useUpdateWidgetChannel()
  const toaster = useToaster()

  const onModalClose = () => {
    onClose()
    resetFlow()
    resetEditWidgetChannelId()
  }

  useEffect(() => {
    if (!widgetChannel) return
    setFlow({
      channel_name: widgetChannel.channel_name,
      config: widgetChannel.config,
      sequence: widgetChannel?.sequence,
      step: 1,
      widget_id: widgetChannel.widget_id
    })
  }, [widgetChannel])

  const editFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toaster('error', validated.error || __('Error', 'bit-assist'))
      return
    }

    const { data, status } = await updateWidgetChannel(flow, editWidgetChannelId)
    toaster(status, data)
    if (status === 'success') onModalClose()
  }

  return (
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
        <ModalHeader mr="6" pb={0}>
          <HStack justifyContent="space-between">
            <Text>{__('Edit Channel', 'bit-assist')}</Text>
            <Button
              colorScheme="purple"
              form="editChannelForm"
              isLoading={isWidgetChannelUpdating}
              loadingText={__('Updating...', 'bit-assist')}
              spinnerPlacement="start"
              type="submit"
            >
              {__('Update', 'bit-assist')}
            </Button>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isWidgetChannelFetching && (
            <Center>
              <Spinner />
            </Center>
          )}
          {!isWidgetChannelFetching && (
            <form id="editChannelForm" onSubmit={editFormSubmit}>
              <ChannelSettings />
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditChannel
