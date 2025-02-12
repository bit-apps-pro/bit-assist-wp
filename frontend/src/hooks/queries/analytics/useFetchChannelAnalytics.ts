import request from '@utils/request'
import { useQuery } from 'react-query'

interface Filter {
  filter?: string | string[]
  filterValue?: Date[] | string
  widget_id?: string
}

export default function useFetchChannelAnalytics(analyticsFilter?: Filter) {
  let filter = [] as string | string[]

  if (Array.isArray(analyticsFilter?.filterValue)) {
    const dates = analyticsFilter?.filterValue.map(date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      return formattedDate
    })
    filter = dates || 'all-time'
  } else {
    filter = analyticsFilter?.filterValue || 'all-time'
  }

  const newAnalyticsFilter = { filter, widget_id: analyticsFilter?.widget_id }

  const { data, isLoading } = useQuery(
    ['channel_analytics', newAnalyticsFilter],
    async () => request('analytics/channel', newAnalyticsFilter),
    {
      enabled: !!newAnalyticsFilter?.widget_id
    }
  )

  return {
    analytics: data?.data,
    isAnalyticsFetching: isLoading
  }
}
