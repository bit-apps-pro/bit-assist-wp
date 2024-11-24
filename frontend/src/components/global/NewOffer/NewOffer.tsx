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

import cls from './NewOffer.module.css'

const addProIfExist = config.IS_PRO ? '-pro' : ''
const redirectUrl = `https://bitapps.pro/wordpress-black-friday-discounts/?utm_source=bit-assist${addProIfExist}&utm_medium=inside-plugin&utm_campaign=black-friday-offer`

export default function NewOffer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button className={cls.button} size="sm" onClick={onOpen} rounded="full" colorScheme="purple">
        Black Friday Deal
        <span className={cls.star} />
        <span className={cls.star} />
        <span className={cls.star} />
      </Button>

      <Modal isCentered size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay zIndex={100000} />
        <ModalContent borderRadius={0} containerProps={{ zIndex: 100000 }}>
          <ModalCloseButton color="white" />

          <Link href={redirectUrl} target="_blank" rel="noopener noreferrer">
            <Image src={config.ROOT_URL + '/img/black-friday.webp'} cursor="pointer" />
          </Link>

          <ModalFooter p={3}>
            <Button
              as="a"
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              rounded="full"
              colorScheme="purple"
              mx="auto"
              _hover={{ color: 'purple.100' }}
            >
              Grab It Now 🚀
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
