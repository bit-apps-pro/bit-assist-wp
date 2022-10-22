import { Box, Button } from '@chakra-ui/react'

function UpdateButton({ isUpdating }: { isUpdating: boolean }) {
  return (
    <Box textAlign="right" mt="4">
      <Button
        type="submit"
        isLoading={isUpdating}
        spinnerPlacement="start"
        loadingText="Updating..."
        colorScheme="purple"
      >
        Update
      </Button>
    </Box>
  )
}

export default UpdateButton
