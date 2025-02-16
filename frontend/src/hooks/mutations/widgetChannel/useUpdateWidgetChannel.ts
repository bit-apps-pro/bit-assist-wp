import { type Flow } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

interface ReqProps {
  flow: Flow
  widgetChannelId: number
}

export default function useUpdateWidgetChannel() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (requestData: ReqProps) =>
      request(`widgetChannels/${requestData.widgetChannelId}/update`, requestData.flow),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
      }
    }
  )

  return {
    isWidgetChannelUpdating: isLoading,
    updateWidgetChannel: (flow: Flow, widgetChannelId: number) => mutateAsync({ flow, widgetChannelId })
  }
}
