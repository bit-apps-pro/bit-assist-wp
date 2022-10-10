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
} from '@chakra-ui/react'
import ChannelSelect from '@components/widgetChannels/ChannelSelect'
import ChannelSettings from '@components/widgetChannels/ChannelSettings'
import { useAtom } from 'jotai'
import { flowAtom, resetFlowAtom } from '@globalStates/atoms'
import { HiPlus } from 'react-icons/hi'
import { MdArrowBackIosNew } from 'react-icons/md'

const AddChannel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [flow] = useAtom(flowAtom)
  const [, resetFlow] = useAtom(resetFlowAtom)

  const onModalClose = () => {
    onClose()
    resetFlow()
  }

  return (
    <>
      <Button mb="4" mr="2" variant="outline" colorScheme="gray" leftIcon={<HiPlus />} onClick={onOpen}>
        Add Channel
      </Button>

      <Modal
        scrollBehavior="inside"
        size="3xl"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onModalClose}
        trapFocus={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              {flow.step > 1 && (
                <Button p="1" size="sm" variant="ghost" onClick={resetFlow}>
                  <MdArrowBackIosNew size="1rem" aria-label="back button" />
                </Button>
              )}
              <Text>Create New Channel</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="4">
            {flow.step === 1 && <ChannelSelect />}
            {flow.step === 2 && <ChannelSettings />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddChannel
