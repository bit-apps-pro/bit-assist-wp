import {
  Button,
  Image,
  Link,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import config from '@config/config'

import cls from './NewRelease.module.css'

export default function NewRelease() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button className={cls.button} size="sm" onClick={onOpen} rounded="full" colorScheme="purple" position="relative">
        New Release
        <span className={cls.star} />
        <span className={cls.star} />
        <span className={cls.star} />
      </Button>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalCloseButton />

          <Link href="https://bit-social.com/" target="_blank" rel="noopener noreferrer">
            <Image src={config.ROOT_URL + '/img/early-bird-offer-bit-social.webp'} cursor="pointer" />
          </Link>

          <ModalFooter pt={0}>
            <Button
              as="a"
              href="https://bit-social.com/"
              target="_blank"
              rel="noopener noreferrer"
              rounded="full"
              colorScheme="purple"
              mx="auto"
            >
              Grab It Now 🚀
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
