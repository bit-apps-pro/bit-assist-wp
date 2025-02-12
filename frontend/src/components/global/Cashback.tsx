import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { FiExternalLink } from 'react-icons/fi'

export default function Cashback() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  const openCashbackModal = () => {
    onOpen()
  }

  return (
    <>
      <Button
        _hover={{ background: '#00d680', color: '#000' }}
        background="#00FFA3"
        borderRadius="full"
        color="#000"
        colorScheme="purple"
        onClick={openCashbackModal}
        size="sm"
      >
        Get $10 Cashback
      </Button>

      <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <VStack>
            <ModalHeader>Get $10 cashback</ModalHeader>
          </VStack>
          <ModalBody>
            Thank you for using Bit Assist! To <b>Get $10 cashback:</b> give us a review on WordPress by
            clicking the{' '}
            <Link
              color="blue"
              href="https://wordpress.org/support/plugin/bit-assist/reviews/#new-post"
              isExternal
              rel="noopener noreferrer"
            >
              Review us
            </Link>{' '}
            button and send an email with the review link to{' '}
            <Link color="blue" href="mailto:support@bitapps.pro" isExternal rel="noopener noreferrer">
              support@bitapps.pro
            </Link>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              _hover={{
                backgroundColor: 'purple.600',
                color: 'white'
              }}
              as="a"
              colorScheme="purple"
              href="https://wordpress.org/support/plugin/bit-assist/reviews/#new-post"
              mr={3}
              rel="noopener noreferrer"
              rightIcon={<FiExternalLink />}
              size="sm"
              target="_blank"
            >
              Review us
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
