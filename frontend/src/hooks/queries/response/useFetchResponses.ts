import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchResponses(pageLimit: number, pageNumber: number) {
  const { widgetChannelId } = useParams()

  const { data, isLoading, isFetching, isFetched } = useQuery(
    ['/api/response/fetch', [widgetChannelId?.toString(), pageNumber, pageLimit]],
    () => request(`/api/response/fetch?page=${pageNumber}&limit=${pageLimit}`, { widgetChannelId }),
    {
      enabled: (!!widgetChannelId?.toString() && !!pageLimit && !!pageNumber),
      keepPreviousData: true,
      staleTime: 3600000, // 60000 × 60 = 1 hour
    },
  )
  return { widgetResponses: data?.data, isResponsesLoading: isLoading, isFetching, isFetched }
}
