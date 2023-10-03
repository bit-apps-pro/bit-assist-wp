import { useMutation, useQueryClient } from 'react-query'
import request from '@utils/request'

export default function useDeleteWidget() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(async (widgetId: string) => request(`widgets/${widgetId}/destroy`), {
    onSuccess: () => {
      queryClient.invalidateQueries('widgets')
      queryClient.invalidateQueries('analytics')
    },
  })

  return {
    deleteWidget: (widgetId: string) => mutateAsync(widgetId),
    isWidgetDeleting: isLoading,
  }
}
