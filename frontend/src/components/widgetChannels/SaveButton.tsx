import { Box, Button, useToast } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import useCreateWidgetChannel from '@hooks/mutations/widgetChannel/useCreateWidgetChannel'
import { widgetChannelValidate } from '@utils/validation'
import { useAtom } from 'jotai'

const SaveButton = () => {
  const [flow] = useAtom(flowAtom)
  const toast = useToast({ isClosable: true })
  const { createWidgetChannel, isWidgetChannelCreating } = useCreateWidgetChannel()

  const addNewWidgetChannel = () => {
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toast({ status: 'error', position: 'top-right', description: validated.error })
      return
    }

    const newFlow = { ...flow }
    delete newFlow['step']
    delete newFlow['channel_name']
    createWidgetChannel(newFlow)
  }

  return (
    <Box textAlign="right" mt="4">
      <Button onClick={addNewWidgetChannel} isLoading={isWidgetChannelCreating} spinnerPlacement="start" loadingText="Saving..." colorScheme="purple">
        Save
      </Button>
    </Box>
  )
}

export default SaveButton
