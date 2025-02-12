import { widgetChannelCountAtom } from '@globalStates/atoms'
import request from '@utils/request'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchWidgetChannels() {
  const { widgetId } = useParams()
  const [, setWidgetChannelCount] = useAtom(widgetChannelCountAtom)

  const { data, isLoading } = useQuery(
    ['widget/widgetChannels', widgetId],
    async () => request(`widgets/${widgetId}/widgetChannels`, undefined, undefined, 'GET'),
    {
      enabled: !!widgetId,
      onSuccess: res => {
        setWidgetChannelCount(res?.data?.length)
      }
    }
  )

  return {
    isWidgetChannelsFetching: isLoading,
    widgetChannels: data?.data
  }
}
