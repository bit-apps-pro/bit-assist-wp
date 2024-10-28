import { WidgetChannelType } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'

interface UpdateSequenceProps {
  id: number
  sequence: number
}

export default function useUpdateWidgetChannelsSequence() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(async (widgetChannels: UpdateSequenceProps[]) =>
    request('widgetChannels/updateSequence', { widgetChannels }),
  )

  const updateSequence = (newWidgetChannels: WidgetChannelType[]) => {
    const { data: oldWidgetChannel } = queryClient.getQueryData<any>(['widget/widgetChannels', widgetId])

    queryClient.setQueryData(['widget/widgetChannels', widgetId], {
      data: newWidgetChannels,
    })

    // Track only channels whose sequence positions changed
    const changedSequences: UpdateSequenceProps[] = newWidgetChannels
      .map((channel, index) => ({
        id: channel.id,
        sequence: index,
      }))
      .filter((channel, index) => oldWidgetChannel[index]?.id !== channel.id)

    if (changedSequences.length >= 2) {
      mutateAsync(changedSequences)
    }
  }

  return {
    updateWidgetChannelsOrder: updateSequence,
    isWidgetChannelOrderUpdating: isLoading,
  }
}
