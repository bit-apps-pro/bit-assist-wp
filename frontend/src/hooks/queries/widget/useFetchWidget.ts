import { widgetAtom } from '@globalStates/atoms'
import request from '@utils/request'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useFetchWidget() {
  const { widgetId } = useParams()
  const [, setWidget] = useAtom(widgetAtom)

  const { data, isLoading } = useQuery(
    ['widgets', widgetId],
    async () => request(`widgets/${widgetId}`, undefined, undefined, 'GET'),
    {
      enabled: !!widgetId,
      onSuccess: data => {
        if (data?.data) {
          setWidget(data?.data)
        }
      }
    }
  )

  return {
    isWidgetFetching: isLoading,
    widget: data?.data
  }
}
