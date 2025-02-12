import {
  Button,
  Image,
  Link,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import config from '@config/config'

import cls from './NewOffer.module.css'

const addProIfExist = config.IS_PRO ? '-pro' : ''
const redirectUrl = `https://bitapps.pro/wordpress-black-friday-discounts/?utm_source=bit-assist${addProIfExist}&utm_medium=inside-plugin&utm_campaign=black-friday-offer`

export default function NewOffer() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button className={cls.button} colorScheme="purple" onClick={onOpen} rounded="full" size="sm">
        Black Friday Deal
        <span className={cls.star} />
        <span className={cls.star} />
        <span className={cls.star} />
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay zIndex={100_000} />
        <ModalContent borderRadius={0} containerProps={{ zIndex: 100_000 }}>
          <ModalCloseButton color="white" />

          <Link href={redirectUrl} rel="noopener noreferrer" target="_blank">
            <Image cursor="pointer" src={config.ROOT_URL + '/img/black-friday.webp'} />
          </Link>

          <ModalFooter p={3}>
            <Button
              _hover={{ color: 'purple.100' }}
              as="a"
              colorScheme="purple"
              href={redirectUrl}
              mx="auto"
              rel="noopener noreferrer"
              rounded="full"
              target="_blank"
            >
              Grab It Now 🚀
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
