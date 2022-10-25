import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

interface ReqProps {
  widgetId: string
  active: number
}

export default function useWidgetActive() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    async (requestData: ReqProps) => request(`widgets/${requestData.widgetId}/changeActive`, { active: requestData.active }, null, 'PUT'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      },
    },
  )

  return {
    updateWidgetActive: (widgetId: string, active: number) => mutateAsync({ widgetId, active }),
    isWidgetActiveUpdating: isLoading,
  }
}
