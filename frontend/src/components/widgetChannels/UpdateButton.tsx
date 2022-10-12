import { Box, Button } from '@chakra-ui/react'
import { editWidgetChannelIdAtom, flowAtom } from '@globalStates/atoms'
import useUpdateWidgetChannel from '@hooks/mutations/widgetChannel/useUpdateWidgetChannel'
import useToaster from '@hooks/useToaster'
import { widgetChannelValidate } from '@utils/validation'
import { useAtom } from 'jotai'

function UpdateButton({ closeModal }: { closeModal: () => void }) {
  const [flow] = useAtom(flowAtom)
  const toaster = useToaster()
  const [editWidgetChannelId] = useAtom(editWidgetChannelIdAtom)
  const { updateWidgetChannel, isWidgetChannelUpdating } = useUpdateWidgetChannel()

  const addNewWidgetChannel = async () => {
    const validated = widgetChannelValidate(flow.config)
    if (validated.hasError) {
      toaster('error', validated.error || 'Error')
      return
    }

    const newFlow = { ...flow }
    delete newFlow.step
    delete newFlow.channel_name
    await updateWidgetChannel(newFlow, editWidgetChannelId)
    closeModal()
  }

  return (
    <Box textAlign="right" mt="4">
      <Button
        onClick={addNewWidgetChannel}
        isLoading={isWidgetChannelUpdating}
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
