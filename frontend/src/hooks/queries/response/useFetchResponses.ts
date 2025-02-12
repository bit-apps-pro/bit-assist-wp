import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchResponses(pageLimit: number, pageNumber: number) {
  const { widgetChannelId } = useParams()

  const { data, isFetched, isFetching, isLoading, refetch } = useQuery(
    ['responses', [widgetChannelId, pageNumber, pageLimit]],
    async () =>
      request(`responses/${widgetChannelId}/${pageNumber}/${pageLimit}`, undefined, undefined, 'GET'),
    {
      enabled: !!widgetChannelId && !!pageLimit && !!pageNumber,
      keepPreviousData: true,
      refetchInterval: 3000,
      staleTime: 3_600_000 // 60000 × 60 = 1 hour,
    }
  )

  return {
    isFetched,
    isFetching,
    isResponsesLoading: isLoading,
    refresh: refetch,
    widgetResponses: data?.data
  }
}
