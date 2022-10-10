import { Box, Button } from '@chakra-ui/react'
import { HiArrowRight } from 'react-icons/hi'

const NextButton = () => {
  return (
    <Box textAlign="right" mt="4">
      <Button colorScheme="purple" rightIcon={<HiArrowRight />}>
        Next
      </Button>
    </Box>
  )
}

export default NextButton
