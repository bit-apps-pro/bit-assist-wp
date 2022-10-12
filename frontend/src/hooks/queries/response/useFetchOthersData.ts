import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchOthersData() {
  const { widgetChannelId } = useParams()

  const { data, isLoading } = useQuery(
    ['responses/othersData', widgetChannelId],
    async () => request(`responses/${widgetChannelId}/othersData`, null, null, 'GET'),
    {
      enabled: !!widgetChannelId,
      staleTime: 3600000, // 60000 × 60 = 1 hour
    },
  )

  return {
    othersData: data?.data,
    isOthersDataLoading: isLoading,
  }
}
