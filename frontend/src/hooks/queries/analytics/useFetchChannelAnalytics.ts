import request from '@utils/request'
import { useQuery, useQueryClient } from 'react-query'

export default function useFetchChannelAnalytics(id: string) {
  const { data, isLoading } = useQuery(
    ['channel_analytics', id],
    async () => request(`analytics/channel/${id}`, null, null, 'GET'), {
      enabled: !!id,
    }
  )

  return {
    analytics: data?.data,
    isAnalyticsFetching: isLoading,
  }
}
