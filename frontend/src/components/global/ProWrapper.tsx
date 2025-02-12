import { Box, Button, Link, useColorModeValue } from '@chakra-ui/react'
import config from '@config/config'
import { type PropsWithChildren } from 'react'

type ProWrapper = PropsWithChildren<{ hide?: boolean }>

export default function ProWrapper({ children, hide }: ProWrapper) {
  const blurBg = useColorModeValue('gray.200', 'whiteAlpha.200')

  if (config.IS_PRO || hide) return <>{children}</>

  return (
    <Box position="relative" w="full">
      <Link href="https://bitapps.pro/bit-assist" tabIndex={-1} target="_blank">
        <Button
          boxShadow="lg"
          colorScheme="purple"
          left="50%"
          position="absolute"
          top="50%"
          transform="translate(-50%, -50%)"
          zIndex="1"
        >
          Get Pro Version
        </Button>
      </Link>
      <Box
        bg={blurBg}
        filter="blur(0.7px)"
        pointerEvents="none"
        px="4"
        py="2"
        rounded="md"
        userSelect="none"
      >
        {children}
      </Box>
    </Box>
  )
}
