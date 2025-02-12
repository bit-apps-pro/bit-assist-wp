import request from '@utils/request'
import { useQuery } from 'react-query'

export default function useFetchAnalytics(filterValue: Date[] | string) {
  let filterOptions = [] as string | string[]

  if (Array.isArray(filterValue)) {
    const dates = filterValue.map(date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      return formattedDate
    })
    filterOptions = dates
  } else {
    filterOptions = filterValue
  }

  const { data, isLoading } = useQuery(
    ['widget_analytics', filterValue],
    async () => request(`analytics/widget/${filterOptions}`, undefined, undefined, 'GET'),
    {
      enabled: !!filterValue
    }
  )

  return {
    analytics: data?.data,
    isAnalyticsFetching: isLoading
  }
}
