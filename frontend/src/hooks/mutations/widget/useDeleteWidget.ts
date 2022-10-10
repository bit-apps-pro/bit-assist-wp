import { useMutation, useQueryClient } from 'react-query'
import request from '@utils/request'

export default function useDeleteWidget() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    async (widgetId: string) => request(`widgets/${widgetId}`, null, null, 'DELETE'), 
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      },
    }
  )

  return {
    deleteWidget: (widgetId: string) => mutateAsync(widgetId),
    isWidgetDeleting: isLoading,
  }
}
