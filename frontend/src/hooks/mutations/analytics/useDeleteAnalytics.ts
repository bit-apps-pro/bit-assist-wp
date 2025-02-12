import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

export default function useDeleteAnalytics() {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(async () => request('analytics/destroy'), {
    onSuccess: () => {
      queryClient.invalidateQueries('widget_analytics')
    }
  })

  return {
    deleteAnalytics: () => mutateAsync(),
    isAnalyticsDeleting: isLoading
  }
}
