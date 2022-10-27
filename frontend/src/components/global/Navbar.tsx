import { ButtonGroup, Container, Flex, Heading, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'

function Navbar() {
  return (
    <Container maxW="container.lg">
      <Stack py="3" direction={['column', 'row']} alignItems={['center', 'initial']} justifyContent={['initial', 'space-between']}>
        <Flex alignItems="center">
          <Link to="/">
            <Heading size="sm">
              Bit Assist
            </Heading>
          </Link>
        </Flex>
        <ButtonGroup>
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
