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
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { FiExternalLink } from 'react-icons/fi'

export default function Cashback() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openCashbackModal = () => () => {
    onOpen()
  }
  return (
    <>
      <Button
        background="#00FFA3"
        colorScheme="purple"
        color="#000"
        size="sm"
        borderRadius="full"
        _hover={{ background: '#00d680', color: '#000' }}
        onClick={openCashbackModal()}
      >
        Get $10 Cashback
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <VStack>
            <ModalHeader>Get $10 cashback</ModalHeader>
          </VStack>
          <ModalBody>
            Thank you for using Bit Assist! To <b>Get $10 cashback:</b> give us a review on WordPress by clicking the{' '}
            <Link
              href="https://wordpress.org/support/plugin/bit-assist/reviews/#new-post"
              isExternal
              rel="noopener noreferrer"
              color="blue"
            >
              Review us
            </Link>{' '}
            button and send an email with the review link to{' '}
            <Link color="blue" rel="noopener noreferrer" isExternal href="mailto:support@bitapps.pro">
              support@bitapps.pro
            </Link>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              as="a"
              href="https://wordpress.org/support/plugin/bit-assist/reviews/#new-post"
              target="_blank"
              rel="noopener noreferrer"
              mr={3}
              size="sm"
              rightIcon={<FiExternalLink />}
              colorScheme="purple"
              _hover={{
                backgroundColor: 'purple.600',
                color: 'white',
              }}
            >
              Review us
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
