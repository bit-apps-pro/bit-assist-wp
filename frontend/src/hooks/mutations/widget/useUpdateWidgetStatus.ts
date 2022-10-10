import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

export default function useUpdateWidgetStatus() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    async (requestData: { widgetId: string; status: boolean }) => await request(`widgets/${requestData.widgetId}/changeStatus`, {status: requestData.status}, null, 'PUT'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      },
    }
  )

  return {
    updateWidgetStatus: (widgetId: string, status: boolean) => mutateAsync({ widgetId, status }),
    isWidgetStatusUpdating: isLoading,
  }
}
