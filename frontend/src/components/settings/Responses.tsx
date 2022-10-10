import { Box, VStack } from '@chakra-ui/react'
import Title from '@components/global/Title'
import DeleteResponses from '@components/settings/DeleteResponses'
import StoreResponses from '@components/settings/StoreResponses'

const Responses = () => {
  return (
    <Box>
      <Title>Responses</Title>
      <VStack alignItems="flex-start">
        {/* <StoreResponses /> */}
        <DeleteResponses />
      </VStack>
    </Box>
  )
}

export default Responses
