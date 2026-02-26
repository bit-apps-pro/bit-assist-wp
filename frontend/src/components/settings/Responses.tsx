import { Box, VStack } from '@chakra-ui/react'
import Title from '@components/global/Title'
import DeleteResponses from '@components/settings/DeleteResponses'
import { __ } from '@wordpress/i18n'

function Responses() {
  return (
    <Box>
      <Title>{__('Responses', 'bit-assist')}</Title>
      <VStack alignItems="flex-start">
        <DeleteResponses />
      </VStack>
    </Box>
  )
}

export default Responses
