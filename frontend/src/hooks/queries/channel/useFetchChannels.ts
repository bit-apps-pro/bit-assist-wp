import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchChannels() {
  const { data, isLoading } = useQuery(
    'channels', 
    async () => request('channels', null, null, 'GET'),
    {
      staleTime: 3600000, // 60000 × 60 = 1 hour
    }
  )

  return { channels: data?.data, isChannelsFetching: isLoading }
}
