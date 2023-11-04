import { Button, ButtonGroup, Container, Divider, Flex, Heading, Stack, Tooltip } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import DarkModeSwitch from './DarkModeSwitch'
import { FaStar } from 'react-icons/fa'
import config from '@config/config'

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
          {config.IS_PRO && (
            <Tooltip
              label="Thank you for purchasing Bit Assist. To get $10 cashback: give us a review on WordPress by clicking the button and send an email with the review link to support@bitapps.pro"
              aria-label="Tooltip"
            >
              <Button
                as="a"
                href="https://wordpress.org/support/plugin/bit-assist/reviews/#new-post"
                target="_blank"
                rel="noopener noreferrer"
                background="#00FFA3"
                size="sm"
                borderRadius="full"
                _hover={{ background: '#00d680' }}
              >
                Get $10 Cashback
              </Button>
            </Tooltip>
          )}
          {!config.IS_PRO && (
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
          )}
          <DarkModeSwitch />
        </ButtonGroup>
      </Stack>
    </Container>
  )
}

export default Navbar
