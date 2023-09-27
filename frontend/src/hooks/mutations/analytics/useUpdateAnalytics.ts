import { Flow } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

interface ReqProps {
  widget_analytics: number
//   status: boolean
}

export default function useUpdateAnalytics() {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    async (requestData: ReqProps) => request('toggleAnalyticsOption', requestData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('analytics')
      },
    },
  )

  return {
    updateAnalytics: (widget_analytics: number) => mutateAsync({widget_analytics}),
    isAnalyticsUpdating: isLoading,
  }
}
