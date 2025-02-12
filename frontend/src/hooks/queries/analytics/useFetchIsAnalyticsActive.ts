import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchIsAnalyticsActive() {
  const { data, isLoading } = useQuery('isAnalyticsActive', async () =>
    request('analytics/active', undefined, undefined, 'GET')
  )

  return {
    isAnalyticsActive: data?.data,
    isFetching: isLoading
  }
}
