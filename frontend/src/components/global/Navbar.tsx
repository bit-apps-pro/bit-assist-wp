import { ButtonGroup, Container, Flex, Heading, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'

import Logo from '@icons/Logo'

function Navbar() {
  return (
    <Container maxW="container.lg">
      <Stack py="5" direction={['column', 'row']} alignItems={['center', 'initial']} justifyContent={['initial', 'space-between']}>
        <Flex alignItems="center" gap={2}>
          <Link to="/">
            <Logo />
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
