import { useMutation, useQueryClient } from 'react-query'
import request from '@utils/request'
import { useParams } from 'react-router-dom'

export default function useDeleteWidgetChannel() {
  const queryClient = useQueryClient()
  const { widgetId } = useParams()

  const { mutateAsync, isLoading } = useMutation(
    async (widgetChannelId: number) => request(`widgetChannels/${widgetChannelId}/destroy`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
        queryClient.invalidateQueries('channel_analytics')
      },
    },
  )

  return {
    deleteWidgetChannel: (widgetChannelId: number) => mutateAsync(widgetChannelId),
    isWidgetChannelDeleting: isLoading,
  }
}
