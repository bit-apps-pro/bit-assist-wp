import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

export default function useUpdateAnalytics() {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (requestData: { widget_analytics: number }) => request('analytics/toggle', requestData),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries('widget_analytics')
        queryClient.invalidateQueries('isAnalyticsActive')
      }
    }
  )

  return {
    isAnalyticsUpdating: isLoading,
    updateAnalytics: (widget_analytics: number) => mutateAsync({ widget_analytics })
  }
}
