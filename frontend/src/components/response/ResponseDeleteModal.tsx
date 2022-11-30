import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

type ResponseDeleteModalProps = {
  isOpen: boolean
  closeDelModal: () => void
  handleDeleteWidget: () => void
  isResponsesDeleting: boolean
}

export default function ResponseDeleteModal({ isOpen, closeDelModal, handleDeleteWidget, isResponsesDeleting }: ResponseDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeDelModal} isCentered>
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
            onClick={handleDeleteWidget}
            isLoading={isResponsesDeleting}
            loadingText="Deleting..."
            colorScheme="red"
            shadow="md"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}