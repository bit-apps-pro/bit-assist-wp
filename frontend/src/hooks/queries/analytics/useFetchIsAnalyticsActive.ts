import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchIsAnalyticsActive() {
  const { data, isLoading } = useQuery(
    'isAnalyticsActive',
    async () => request('analytics/active', null, null, 'GET'),
  )

  return {
    isAnalyticsActive: data?.data,
    isFetching: isLoading,
  }
}
