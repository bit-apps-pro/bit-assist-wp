import { Box, Button, Link, useColorModeValue } from '@chakra-ui/react'
import config from '@config/config'
import { PropsWithChildren } from 'react'

type ProWrapper = PropsWithChildren<{ hide?: boolean }>

export default function ProWrapper({ children, hide }: ProWrapper) {
  const blurBg = useColorModeValue('gray.200', 'whiteAlpha.200')

  if (config.IS_PRO || hide) return <>{children}</>

  return (
    <Box w="full" position="relative">
      <Link href="https://bitapps.pro/bit-assist" target="_blank" tabIndex={-1}>
        <Button
          position="absolute"
          zIndex="1"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          colorScheme="purple"
          boxShadow="lg"
        >
          Get Pro Version
        </Button>
      </Link>
      <Box filter="blur(0.7px)" bg={blurBg} pointerEvents="none" py="2" px="4" rounded="md" userSelect="none">
        {children}
      </Box>
    </Box>
  )
}
