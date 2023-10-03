import request from '@utils/request'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { widgetAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'

export default function useFetchWidget() {
  const { widgetId } = useParams()
  const [, setWidget] = useAtom(widgetAtom);

  const { data, isLoading } = useQuery(
    ['widgets', widgetId],
    async () => request(`widgets/${widgetId}`, null, null, 'GET'),
    {
      enabled: !!widgetId,
      onSuccess: (data) => {
        if(data?.data){
          setWidget(data?.data);
        }
      },
    },
  )

  return {
    widget: data?.data,
    isWidgetFetching: isLoading,
  }
}
