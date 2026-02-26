import { Box, Button } from '@chakra-ui/react'
import { __ } from '@wordpress/i18n'
import { HiArrowRight } from 'react-icons/hi'

function NextButton() {
  return (
    <Box mt="4" textAlign="right">
      <Button colorScheme="purple" rightIcon={<HiArrowRight />}>
        {__('Next', 'bit-assist')}
      </Button>
    </Box>
  )
}

export default NextButton
