import { ButtonGroup, Container, Flex, Heading, Image, Stack } from '@chakra-ui/react'
import config from '@config/config'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'

function Navbar() {
  return (
    <Container maxW="container.lg">
      <Stack py="5" direction={['column', 'row']} alignItems={['center', 'initial']} justifyContent={['initial', 'space-between']}>
        <Flex alignItems="center" gap={2}>
          <Link to="/">
            <Image src={`${config.ROOT_URL}/img/logo.svg`} w="10" />
          </Link>
          <Link to="/">
            <Heading size="md">
              Bit Assist
            </Heading>
          </Link>
        </Flex>
        <ButtonGroup alignItems="center">
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
