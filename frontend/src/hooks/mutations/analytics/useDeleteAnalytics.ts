import { useMutation, useQueryClient } from 'react-query'
import request from '@utils/request'

export default function useDeleteAnalytics() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(async () => request('analytics/destroy'), {
    onSuccess: () => {
      queryClient.invalidateQueries('widget_analytics')
    },
  })

  return {
    deleteAnalytics: () => mutateAsync(),
    isAnalyticsDeleting: isLoading,
  }
}
