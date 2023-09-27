import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchAnalytics() {
  const { data, isLoading } = useQuery(
    'analytics',
    async () => request('isAnalyticsActive', null, null, 'GET'),
  )

  return {
    analytics: data?.data,
    isAnalyticsFetching: isLoading,
    
  }
}
