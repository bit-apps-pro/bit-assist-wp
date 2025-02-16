import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useCopyWidgetChannel() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (widgetChannelId: number) =>
      request(`copyWidgetChannel/${widgetChannelId}`, undefined, undefined, 'GET'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
      }
    }
  )

  return {
    copyWidgetChannel: (widgetChannelId: number) => mutateAsync(widgetChannelId),
    isWidgetChannelCoping: isLoading
  }
}
