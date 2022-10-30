import { Box, Button, Link } from '@chakra-ui/react'
import { isProAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function ProWrapper({ children }: { children: React.ReactNode }) {
  const [isPro] = useAtom(isProAtom)

  if (isPro) return <>{children}</> // eslint-disable-line react/jsx-no-useless-fragment

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
