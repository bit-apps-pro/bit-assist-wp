import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchWidgets() {
  const { data, isLoading } = useQuery('widgets', async () =>
    request('widgets', undefined, undefined, 'GET')
  )

  return {
    isWidgetFetching: isLoading,
    widgets: data?.data
  }
}
