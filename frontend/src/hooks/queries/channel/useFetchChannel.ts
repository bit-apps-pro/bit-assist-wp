import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchChannel(channelId: string) {
  const { data, isLoading } = useQuery(
    ['channels', channelId],
    async () => request(`channels/${channelId}`, null, null, 'GET'),
    {
      enabled: !!channelId,
    },
  )

  return {
    channel: data?.data,
    isChannelFetching: isLoading,
  }
}
