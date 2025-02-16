import { type WidgetChannelType } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

interface UpdateSequenceProps {
  id: number
  sequence: number
}

export default function useUpdateWidgetChannelsSequence() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(async (widgetChannels: UpdateSequenceProps[]) =>
    request('widgetChannels/updateSequence', { widgetChannels })
  )

  const updateSequence = (newWidgetChannels: WidgetChannelType[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: oldWidgetChannel } = queryClient.getQueryData<any>(['widget/widgetChannels', widgetId])

    queryClient.setQueryData(['widget/widgetChannels', widgetId], {
      data: newWidgetChannels
    })

    // Track only channels whose sequence positions changed
    const changedSequences: UpdateSequenceProps[] = newWidgetChannels
      .map((channel, index) => ({
        id: channel.id,
        sequence: index
      }))
      .filter((channel, index) => oldWidgetChannel[index]?.id !== channel.id)

    if (changedSequences.length >= 2) {
      mutateAsync(changedSequences)
    }
  }

  return {
    isWidgetChannelOrderUpdating: isLoading,
    updateWidgetChannelsOrder: updateSequence
  }
}
