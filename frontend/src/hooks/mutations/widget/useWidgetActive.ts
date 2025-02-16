import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

interface ReqProps {
  active: number
  widgetId: string
}

export default function useWidgetActive() {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (requestData: ReqProps) =>
      request(`pro/widgets/${requestData.widgetId}/changeActive`, { active: requestData.active }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
      }
    }
  )

  return {
    isWidgetActiveUpdating: isLoading,
    updateWidgetActive: (widgetId: string, active: number) => mutateAsync({ active, widgetId })
  }
}
