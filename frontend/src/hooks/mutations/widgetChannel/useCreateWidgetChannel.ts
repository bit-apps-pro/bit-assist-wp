import { useMutation, useQueryClient } from 'react-query'
import { Flow } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useAtom } from 'jotai'
import { resetFlowAtom } from '@globalStates/atoms'
import { useParams } from 'react-router-dom'

export default function useCreateWidgetChannel() {
  const [, resetFlow] = useAtom(resetFlowAtom)
  const queryClient = useQueryClient()
  const { widgetId } = useParams()

  const { mutateAsync, isLoading } = useMutation(async (flow: Flow) => request('widgetChannels', flow), {
    onSuccess: () => {
      resetFlow('')
      queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
    },
  })

  return {
    createWidgetChannel: (flow: Flow) => mutateAsync(flow),
    isWidgetChannelCreating: isLoading,
  }
}
