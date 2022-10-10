import { useMutation, useQueryClient } from 'react-query'
import { Flow } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useAtom } from 'jotai'
import { resetFlowAtom } from '@globalStates/atoms'
import { useToast } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

export default function useCreateWidgetChannel() {
  const [, resetFlow] = useAtom(resetFlowAtom)
  const queryClient = useQueryClient()
  const { widgetId } = useParams()
  const toast = useToast({ isClosable: true })

  const { mutate, isLoading } = useMutation(
    async (flow: Flow) => request('widgetChannels', flow), 
    {
      onSuccess: () => {
        resetFlow()
        toast({ status: 'success', position: 'top-right', title: 'Widget channel created' })
        queryClient.invalidateQueries(['widget/widgetChannels', widgetId])
      },
    }
  )

  return {
    createWidgetChannel: (flow: Flow) => mutate(flow),
    isWidgetChannelCreating: isLoading,
  }
}
