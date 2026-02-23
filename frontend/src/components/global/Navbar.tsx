import { Button, ButtonGroup, Container, Flex, Heading, Stack } from '@chakra-ui/react'
import config from '@config/config'
import { __ } from '@helpers/i18nwrap'
import Logo from '@icons/Logo'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import DarkModeSwitch from './DarkModeSwitch'
import DocTutorials from './DocTutorials'

function Navbar() {
  return (
    <Container maxW="1170px" px={[4, 6]}>
      <Stack
        alignItems={['center', 'initial']}
        direction={['column', 'row']}
        justifyContent={['initial', 'space-between']}
        py="5"
      >
        <Flex alignItems="center" gap={2}>
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/">
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <Heading size="md">Bit Assist</Heading>
          </Link>
        </Flex>
        <ButtonGroup alignItems="center">
          <DocTutorials
            docLink="https://bitapps.pro/docs/bit-assist/"
            tutorial="https://www.youtube.com/watch?v=atVwkzFNnmM&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5"
          />

          {!config.IS_PRO && (
            <Button
              as="a"
              borderRadius={'full'}
              href={'https://wordpress.org/support/plugin/bit-assist/reviews/#new-post'}
              leftIcon={<FaStar color="orange" />}
              rel="noopener noreferrer"
              size="sm"
              target="_blank"
            >
              {__('Review Us')}
            </Button>
          )}
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
