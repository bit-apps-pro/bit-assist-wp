import { Flow } from '@globalStates/Interfaces'
import useToaster from '@hooks/useToaster'
import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

interface ReqProps {
  flow: Flow
  widgetChannelId: string
}

export default function useUpdateWidgetChannel() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()
  const toaster = useToaster()

  const { mutateAsync, isLoading } = useMutation(
    async (requestData: ReqProps) => request(`widgetChannels/${requestData.widgetChannelId}`, requestData.flow, null, 'PUT'),
    {
      onSuccess: () => {
        toaster('success', 'Widget channel updated')
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
      },
    },
  )

  return {
    updateWidgetChannel: (flow: Flow, widgetChannelId: string) => mutateAsync({ flow, widgetChannelId }),
    isWidgetChannelUpdating: isLoading,
  }
}
