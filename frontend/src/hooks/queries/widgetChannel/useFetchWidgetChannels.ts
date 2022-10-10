import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchWidgetChannels() {
  const { widgetId } = useParams()

  const { data, isLoading } = useQuery(
    ['widget/widgetChannels', widgetId],
    async () => request(`widgets/${widgetId}/widgetChannels`, null, null, 'GET'),
    {
      enabled: !!widgetId,
    }
  )

  return { widgetChannels: data?.data, isWidgetChannelsFetching: isLoading }
}
