import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchOthersData() {
  const { widgetChannelId } = useParams()

  const { data, isLoading } = useQuery(
    ['responses/othersData', widgetChannelId],
    async () => request(`responses/${widgetChannelId}/othersData`, undefined, undefined, 'GET'),
    {
      enabled: !!widgetChannelId,
      staleTime: 3_600_000 // 60000 × 60 = 1 hour
    }
  )

  return {
    isOthersDataLoading: isLoading,
    othersData: data?.data
  }
}
