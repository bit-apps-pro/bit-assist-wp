import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { __, sprintf } from '@wordpress/i18n'

interface ProModalProps {
  icon: React.ReactElement
  number: number
  text: string
  type: string
}

export default function ProModal({ icon, number, text, type }: ProModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button colorScheme="purple" leftIcon={icon} mb="4" mr="2" onClick={onOpen} variant="outline">
        {text}
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="xl">
        <ModalOverlay />
        <ModalContent pb="4">
          <ModalHeader>
            <Text>
              {sprintf(
                // translators: %s: Product type (e.g. channels, widgets)
                __('Want to use unlimited %s?', 'bit-assist'),
                `${type}s`
              )}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex alignItems="center" justifyContent="space-between">
              <Box>
                <Text fontSize="md">
                  {__('You can use', 'bit-assist')} <strong>{`${number} ${type}`}</strong>{' '}
                  {__('in free version.', 'bit-assist')}
                </Text>
                <Text fontSize="md">
                  {sprintf(
                    // translators: %s: Product type (e.g. channels, widgets)
                    __('Get premium version to use unlimited %s.', 'bit-assist'),
                    `${type}s`
                  )}
                </Text>
              </Box>
              <Box textAlign="right">
                <Link
                  _hover={{ underline: 'none' }}
                  href="https://www.bitapps.pro/bit-assist"
                  tabIndex={-1}
                  target="_blank"
                >
                  <Button colorScheme="purple">{__('Get Pro Version', 'bit-assist')}</Button>
                </Link>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
