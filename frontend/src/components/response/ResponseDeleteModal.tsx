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
import { __ } from '@wordpress/i18n'

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
        <ModalHeader>{__('Confirmation', 'bit-assist')}</ModalHeader>
        <ModalCloseButton disabled={isResponsesDeleting} />
        <ModalBody>{__('Are you sure want to delete selected responses?', 'bit-assist')}</ModalBody>

        <ModalFooter>
          <Button disabled={isResponsesDeleting} mr={3} onClick={closeDelModal}>
            {__('Cancel', 'bit-assist')}
          </Button>
          <Button
            colorScheme="red"
            isLoading={isResponsesDeleting}
            loadingText={__('Deleting...', 'bit-assist')}
            onClick={handleDeleteWidget}
            shadow="md"
          >
            {__('Delete', 'bit-assist')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
