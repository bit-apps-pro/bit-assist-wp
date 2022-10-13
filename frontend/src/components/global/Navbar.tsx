import { Box, Button, ButtonGroup, Container, Heading, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { DarkModeSwitch } from './DarkModeSwitch'

function Navbar() {
  return (
    <Container maxW="container.lg">
      <Stack py="4" direction={['column', 'row']} alignItems={['center', 'initial']} justifyContent={['initial', 'space-between']}>
        <Box py="2">
          <Heading size="md" >
            <Link to="/">Bit Assist</Link>
          </Heading>
        </Box>
        <ButtonGroup>
          <Link to="/">
            <Button colorScheme="purple" variant="ghost">
              Widgets
            </Button>
          </Link>

          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
