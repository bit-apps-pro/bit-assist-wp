import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchWidgets() {
  const { data, isLoading } = useQuery(
    'widgets',
    async () => request('widgets', null, null, 'GET'),
  )

  return { widgets: data?.data, isWidgetFetching: isLoading }
}
