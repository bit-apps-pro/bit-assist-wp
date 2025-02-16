import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useDeleteResponses(pageLimit: number, pageNumber: number) {
  const queryClient = useQueryClient()
  const { widgetChannelId } = useParams()

  const { isLoading, mutateAsync } = useMutation(
    async (responseIds: string[]) => request('responsesDelete', { responseIds }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['responses', [widgetChannelId, pageNumber, pageLimit]])
        queryClient.invalidateQueries(['responses/othersData', widgetChannelId])
      }
    }
  )

  return {
    deleteResponses: (responseIds: string[]) => mutateAsync(responseIds),
    isResponsesDeleting: isLoading
  }
}
