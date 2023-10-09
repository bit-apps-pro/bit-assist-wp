import request from '@utils/request'
import { useQuery, useQueryClient } from 'react-query'

interface Filter {
  widget_id?: string,
  filterValue?: string | Date[],
  filter?: string | string[]
}

export default function useFetchChannelAnalytics(analyticsFilter?: Filter) {
  let filter = <string[] | string>[]

  if(Array.isArray(analyticsFilter?.filterValue)){
    const dates = analyticsFilter?.filterValue.map(date => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return formattedDate
    })
    filter = dates ? dates : 'all-time'
  } else{
    filter = analyticsFilter?.filterValue ? analyticsFilter?.filterValue : 'all-time'
  }

  analyticsFilter = {widget_id: analyticsFilter?.widget_id, filter}

  const { data, isLoading } = useQuery(
    ['channel_analytics', analyticsFilter],
    async () => request('analytics/channel', analyticsFilter),
    {
      enabled: !!analyticsFilter?.widget_id,
    }
  )

  return {
    analytics: data?.data,
    isAnalyticsFetching: isLoading,
  }
}