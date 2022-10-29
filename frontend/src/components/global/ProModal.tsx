import { Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Link } from '@chakra-ui/react'

export default function ProModal({ type, number, text, icon }: { type: string, number: string, text: string, icon: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button mb="4" mr="2" variant="outline" colorScheme="gray" leftIcon={icon} onClick={onOpen}>
        {text}
      </Button>

      <Modal isCentered scrollBehavior="inside" size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb="4">
          <ModalHeader>
            <Text>{`Want to use unlimited ${type}s?`}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="md">
              You can use
              {' '}
              <strong>{`${number} ${type}`}</strong>
              {' '}
              in free version.
            </Text>
            <Text fontSize="md" mb="6">
              {`Get premium version to use unlimited ${type}s.`}
            </Text>

            <Link href="https://www.bitapps.pro/bit-assist" target="_blank" _hover={{ underline: 'none' }}>
              <Button colorScheme="purple">Buy Pro</Button>
            </Link>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
