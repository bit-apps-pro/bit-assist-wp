import { useToast } from '@chakra-ui/react'
import { Flow } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

export default function useUpdateWidgetChannel() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()
  const toast = useToast({ isClosable: true })

  const { mutateAsync, isLoading } = useMutation(
    (requestData: { flow: Flow; widgetChannelId: string }) => request(`widgetChannels/${requestData.widgetChannelId}`, requestData.flow , null, 'PUT'),
    {
      onSuccess: () => {
        toast({ status: 'success', position: 'top-right', title: 'Widget channel updated.' })
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
      },
    },
  )

  return {
    updateWidgetChannel: (flow: Flow, widgetChannelId: string) => mutateAsync({ flow, widgetChannelId }),
    isWidgetChannelUpdating: isLoading,
  }
}
