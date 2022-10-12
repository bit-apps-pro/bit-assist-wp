import { useMutation, useQueryClient } from 'react-query'
import { Flow } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useAtom } from 'jotai'
import { resetFlowAtom } from '@globalStates/atoms'
import { useParams } from 'react-router-dom'
import useToaster from '@hooks/useToaster'

export default function useCreateWidgetChannel() {
  const [, resetFlow] = useAtom(resetFlowAtom)
  const queryClient = useQueryClient()
  const { widgetId } = useParams()
  const toaster = useToaster()

  const { mutate, isLoading } = useMutation(
    async (flow: Flow) => request('widgetChannels', flow),
    {
      onSuccess: () => {
        resetFlow()
        toaster('success', 'Widget channel created')
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
      },
    },
  )

  return {
    createWidgetChannel: (flow: Flow) => mutate(flow),
    isWidgetChannelCreating: isLoading,
  }
}
