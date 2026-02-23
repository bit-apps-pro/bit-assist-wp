import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { __ } from '@helpers/i18nwrap'

interface ResponseDeleteModalProps {
  closeDelModal: () => void
  handleDeleteWidget: () => void
  isOpen: boolean
  isResponsesDeleting: boolean
}

export default function ResponseDeleteModal({
  closeDelModal,
  handleDeleteWidget,
  isOpen,
  isResponsesDeleting
}: ResponseDeleteModalProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={closeDelModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{__('Confirmation')}</ModalHeader>
        <ModalCloseButton disabled={isResponsesDeleting} />
        <ModalBody>{__('Are you sure want to delete selected responses?')}</ModalBody>

        <ModalFooter>
          <Button disabled={isResponsesDeleting} mr={3} onClick={closeDelModal}>
            {__('Cancel')}
          </Button>
          <Button
            colorScheme="red"
            isLoading={isResponsesDeleting}
            loadingText={__('Deleting...')}
            onClick={handleDeleteWidget}
            shadow="md"
          >
            {__('Delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
