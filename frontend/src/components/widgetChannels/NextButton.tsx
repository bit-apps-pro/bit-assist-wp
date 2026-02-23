import { Box, Button } from '@chakra-ui/react'
import { __ } from '@helpers/i18nwrap'
import { HiArrowRight } from 'react-icons/hi'

function NextButton() {
  return (
    <Box mt="4" textAlign="right">
      <Button colorScheme="purple" rightIcon={<HiArrowRight />}>
        {__('Next')}
      </Button>
    </Box>
  )
}

export default NextButton
