import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  VStack,
  useDisclosure,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'
import { FaStar } from 'react-icons/fa'
import config from '@config/config'
import Logo from '@icons/Logo'
import DocTutorials from './DocTutorials'
import { FiExternalLink } from 'react-icons/fi'

const PRODUCT_NAME = 'Bit Assist'
const REVIEW_URL = 'https://wordpress.org/support/plugin/bit-assist/reviews/#new-post'

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openCashbackModal = () => () => {
    onOpen()
  }

  return (
    <Container maxW="1170px" px={[4, 6]}>
      <Stack
        py="5"
        direction={['column', 'row']}
        alignItems={['center', 'initial']}
        justifyContent={['initial', 'space-between']}
      >
        <Flex alignItems="center" gap={2}>
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/">
            <Heading size="md">Bit Assist</Heading>
          </Link>
        </Flex>
        <ButtonGroup alignItems="center">
          <DocTutorials
            tutorial="https://www.youtube.com/watch?v=atVwkzFNnmM&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5"
            docLink="https://bitapps.pro/docs/bit-assist/"
          />
          {config.IS_PRO && (
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
          )}
          {!config.IS_PRO && (
            <Button
              as="a"
              href={'https://wordpress.org/support/plugin/bit-assist/reviews/#new-post'}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaStar color="orange" />}
              size="sm"
              borderRadius={'full'}
            >
              Review Us
            </Button>
          )}
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <VStack>
            <ModalHeader>Get $10 cashback</ModalHeader>
          </VStack>
          <ModalBody>
            Thank you for using Bit Assist! To <b>Get $10 cashback:</b> give us a review on WordPress by clicking the{' '}
            <ChakraLink
              href="https://wordpress.org/support/plugin/bit-assist/reviews/#new-post"
              isExternal
              rel="noopener noreferrer"
              color="blue"
            >
              Review us
            </ChakraLink>{' '}
            button and send an email with the review link to{' '}
            <ChakraLink color="blue" rel="noopener noreferrer" isExternal href="mailto:support@bitapps.pro">
              support@bitapps.pro
            </ChakraLink>
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
    </Container>
  )
}

export default Navbar
