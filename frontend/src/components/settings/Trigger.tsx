import { Box } from '@chakra-ui/react'
import Title from '@components/global/Title'
import InitialDelay from '@components/settings/InitialDelay'
import PageScroll from '@components/settings/PageScroll'

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
