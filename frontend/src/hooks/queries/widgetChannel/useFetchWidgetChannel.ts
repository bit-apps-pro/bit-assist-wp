import { editWidgetChannelIdAtom } from '@globalStates/atoms'
import request from '@utils/request'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'

export default function useFetchWidgetChannels() {
  const [editWidgetChannelId] = useAtom(editWidgetChannelIdAtom)

  const { data, isLoading } = useQuery(
    ['widgetChannels', editWidgetChannelId],
    async () => request(`widgetChannels/${editWidgetChannelId}`, undefined, undefined, 'GET'),
    {
      enabled: !!editWidgetChannelId
    }
  )

  return {
    isWidgetChannelFetching: isLoading,
    widgetChannel: data?.data
  }
}
