import { ButtonGroup, Container, Flex, Heading, Stack, Switch } from '@chakra-ui/react'
import { isProAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'

function Navbar() {
  const [isPro, setIsPro] = useAtom(isProAtom)
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
        <ButtonGroup alignItems="center">
          <p>{isPro ? 'Pro' : 'Free'}</p>
          <Switch isChecked={isPro} onChange={(e) => setIsPro(e.target.checked)} colorScheme="purple" />
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
