import { Box, Stack, Text } from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import CDN from './CDN'
import Domains from './Domains'

function Publish() {
  return (
    <Stack gap={[5, 6]}>
      <Box>
        <Text mb={4} py="1" px="3" borderLeft="4px" borderColor="purple.500" fontWeight="medium" fontSize="md">
          If you want to use this widget in other domain follow these steps.
        </Text>
        <ProWrapper>
          <Stack gap={[5, 6]}>
            <Domains />
            <CDN />
          </Stack>
        </ProWrapper>
      </Box>
    </Stack>
  )
}

export default Publish
