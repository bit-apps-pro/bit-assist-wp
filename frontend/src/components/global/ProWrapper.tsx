import { Box, Button, Link } from '@chakra-ui/react'
import config from '@config/config'

export default function ProWrapper({ children }: { children: React.ReactNode }) {
  if (config.IS_PRO) return <>{children}</> // eslint-disable-line react/jsx-no-useless-fragment

  return (
    <Box w="full" position="relative">
      <Link href="https://bitapps.pro/bit-assist" target="_blank">
        <Button position="absolute" zIndex="1" left="50%" top="50%" transform="translate(-50%, -50%)" colorScheme="purple">
          Buy Pro
        </Button>
      </Link>
      <Box filter="blur(1.5px)" bg="blackAlpha.200" pointerEvents="none" py="2" px="4" rounded="md">
        {children}
      </Box>
    </Box>
  )
}
