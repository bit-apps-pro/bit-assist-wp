import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

export default function useCopyWidget() {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (widgetId: string) => request(`copyWidget/${widgetId}`, undefined, undefined, 'GET'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      }
    }
  )

  return {
    copyWidget: (widgetId: string) => mutateAsync(widgetId),
    isWidgetCoping: isLoading
  }
}
