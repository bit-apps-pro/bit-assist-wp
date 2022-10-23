import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import Active from './Active'
import CDN from './CDN'
import Domains from './Domains'

function Publish() {
  const hrColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Stack gap={[5, 10]}>
      <Active />
      <Box bg={hrColor} w="full" h="1px" />
      <Box>
        <Text mb={4} p="2" borderLeft="4px" borderColor="purple.500" fontWeight="medium" fontSize="md">
          If you want to use this widget in other domain follow these steps.
        </Text>
        <Stack gap={[5, 10]}>
          <Domains />
          <CDN />
        </Stack>
      </Box>
    </Stack>
  )
}

export default Publish
