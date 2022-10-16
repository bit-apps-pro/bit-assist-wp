import request from '@utils/request'
import { useMutation } from 'react-query'

interface ReqProps {
  widgetId: string
  active: boolean
}

export default function useWidgetActive() {
  const { mutateAsync, isLoading } = useMutation(
    async (requestData: ReqProps) => request(`widgets/${requestData.widgetId}/changeActive`, { active: requestData.active }, null, 'PUT'),
  )

  return {
    updateWidgetActive: (widgetId: string, active: boolean) => mutateAsync({ widgetId, active }),
    isWidgetActiveUpdating: isLoading,
  }
}
