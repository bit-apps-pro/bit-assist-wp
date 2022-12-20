import InitialDelay from '@components/settings/InitialDelay'
import PageScroll from '@components/settings/PageScroll'
import Title from '@components/global/Title'
import { Box, VStack } from '@chakra-ui/react'

function Trigger() {
  return (
    <Box>
      <Title>Trigger Widget</Title>
      <InitialDelay />
      <PageScroll />
    </Box>
  )
}

export default Trigger
