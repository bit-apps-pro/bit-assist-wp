import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

export default function useDeleteWidget() {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (widgetId: string) => request(`widgets/${widgetId}/destroy`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
        queryClient.invalidateQueries('widget_analytics')
      }
    }
  )

  return {
    deleteWidget: (widgetId: string) => mutateAsync(widgetId),
    isWidgetDeleting: isLoading
  }
}
