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

const addProIfExist = config.IS_PRO ? '-pro' : ''
const redirectUrl = `https://bit-social.com/?utm_source=bit-assist${addProIfExist}&utm_medium=referral&utm_campaign=early-bird-offer`

export default function NewRelease() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button className={cls.button} size="sm" onClick={onOpen} rounded="full" colorScheme="purple">
        New Release
        <span className={cls.star} />
        <span className={cls.star} />
        <span className={cls.star} />
      </Button>

      <Modal isCentered size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay zIndex={100000} />
        <ModalContent borderRadius={0} containerProps={{ zIndex: 100000 }}>
          <ModalCloseButton />

          <Link href={redirectUrl} target="_blank" rel="noopener noreferrer">
            <Image src={config.ROOT_URL + '/img/early-bird-offer-bit-social.webp'} cursor="pointer" />
          </Link>

          <ModalFooter pt={0}>
            <Button
              as="a"
              href={redirectUrl}
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
