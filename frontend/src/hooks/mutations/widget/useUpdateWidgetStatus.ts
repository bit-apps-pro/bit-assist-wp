import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

interface ReqProps {
  status: boolean
  widgetId: string
}

export default function useUpdateWidgetStatus() {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (requestData: ReqProps) =>
      request(`widgets/${requestData.widgetId}/changeStatus`, { status: requestData.status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      }
    }
  )

  return {
    isWidgetStatusUpdating: isLoading,
    updateWidgetStatus: (widgetId: string, status: boolean) => mutateAsync({ status, widgetId })
  }
}
