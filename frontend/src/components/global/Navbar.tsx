import { Button, ButtonGroup, Container, Divider, Flex, Heading, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'
import { FaStar } from 'react-icons/fa'

import Logo from '@icons/Logo'
import DocTutorials from './DocTutorials'

function Navbar() {
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
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
