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
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton disabled={isResponsesDeleting} />
        <ModalBody>Are you sure want to delete selected responses?</ModalBody>

        <ModalFooter>
          <Button disabled={isResponsesDeleting} mr={3} onClick={closeDelModal}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            isLoading={isResponsesDeleting}
            loadingText="Deleting..."
            onClick={handleDeleteWidget}
            shadow="md"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
