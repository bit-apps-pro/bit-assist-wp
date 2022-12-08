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

function AddChannel() {
  const { isOpen, onOpen, onClose } = useDisclosure()
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

    const { status, data } = await createWidgetChannel(flow)
    toaster(status, data)
    if (status === 'success') onModalClose()
  }

  return (
    <>
      <Button mb="4" mr="2" variant="outline" colorScheme="gray" leftIcon={<HiPlus />} onClick={onOpen}>
        Add Channel
      </Button>

      <Modal scrollBehavior="inside" size="3xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent pb="4">
          <ModalHeader mr="6">
            <HStack justifyContent="space-between">
              <HStack>
                {flow.step > 1 && (
                  <Button p="1" size="sm" variant="ghost" onClick={resetFlow}>
                    <MdArrowBackIosNew size="1rem" aria-label="back button" />
                  </Button>
                )}
                <Text>Create New Channel</Text>
              </HStack>
              {flow.step === 2 && (
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
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {flow.step === 1 && <ChannelSelect />}
            {flow.step === 2 && (
              <form onSubmit={saveFormSubmit} id="createNewChannelForm">
                <ChannelSettings />
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddChannel
