import { Box, Button } from '@chakra-ui/react'
import { HiArrowRight } from 'react-icons/hi'

function NextButton() {
  return (
    <Box mt="4" textAlign="right">
      <Button colorScheme="purple" rightIcon={<HiArrowRight />}>
        Next
      </Button>
    </Box>
  )
}

export default NextButton
