import { Box, Button } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import useCreateWidgetChannel from '@hooks/mutations/widgetChannel/useCreateWidgetChannel'
import useToaster from '@hooks/useToaster'
import { widgetChannelValidate } from '@utils/validation'
import { useAtom } from 'jotai'

function SaveButton() {
  const [flow] = useAtom(flowAtom)
  const toaster = useToaster()
  const { createWidgetChannel, isWidgetChannelCreating } = useCreateWidgetChannel()

  const addNewWidgetChannel = () => {
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toaster('error', validated.error || 'Error')
      return
    }

    const newFlow = { ...flow }
    delete newFlow.step
    delete newFlow.channel_name
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
