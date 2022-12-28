import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

interface ReqProps {
  widgetId: string
  status: boolean
}

export default function useUpdateWidgetStatus() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    async (requestData: ReqProps) =>
      request(`widgets/${requestData.widgetId}/changeStatus`, { status: requestData.status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      },
    },
  )

  return {
    updateWidgetStatus: (widgetId: string, status: boolean) => mutateAsync({ widgetId, status }),
    isWidgetStatusUpdating: isLoading,
  }
}
