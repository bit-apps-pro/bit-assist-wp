import { Box, Button } from '@chakra-ui/react'

function SaveButton({ isSaving }: { isSaving: boolean }) {
  return (
    <Box textAlign="right" mt="4">
      <Button
        isLoading={isSaving}
        type="submit"
        spinnerPlacement="start"
        loadingText="Saving..."
        colorScheme="purple"
      >
        Save
      </Button>
    </Box>
  )
}

export default SaveButton
