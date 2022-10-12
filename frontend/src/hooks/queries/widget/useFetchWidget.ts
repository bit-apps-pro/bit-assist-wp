import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchWidget() {
  const { widgetId } = useParams()

  const { data, isLoading } = useQuery(
    ['widgets', widgetId],
    async () => request(`widgets/${widgetId}`, null, null, 'GET'),
    {
      enabled: !!widgetId,
    },
  )

  return {
    widget: data?.data,
    isWidgetFetching: isLoading,
  }
}
