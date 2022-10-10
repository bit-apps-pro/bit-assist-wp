import InitialDelay from '@components/settings/InitialDelay'
import PageScroll from '@components/settings/PageScroll'
import Title from '@components/global/Title'
import { Box, VStack } from '@chakra-ui/react'

const Trigger = () => {
  return (
    <Box>
      <Title>Trigger Widget</Title>
      <VStack alignItems="flex-start">
        <InitialDelay />
        <PageScroll />
      </VStack>
    </Box>
  )
}

export default Trigger
