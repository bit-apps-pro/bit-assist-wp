import { Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Link,
  Box,
  Flex } from '@chakra-ui/react'

interface ProModalProps {
  type: string
  number: number
  text: string
  icon: React.ReactElement
}

export default function ProModal({ type, number, text, icon }: ProModalProps) {
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
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize="md">
                  You can use
                  {' '}
                  <strong>{`${number} ${type}`}</strong>
                  {' '}
                  in free version.
                </Text>
                <Text fontSize="md">
                  {`Get premium version to use unlimited ${type}s.`}
                </Text>
              </Box>
              <Box textAlign="right">
                <Link href="https://www.bitapps.pro/bit-assist" target="_blank" _hover={{ underline: 'none' }}>
                  <Button colorScheme="purple">Buy Pro</Button>
                </Link>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
