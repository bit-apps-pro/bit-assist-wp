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
    request('widgetChannels/updateSequence', { widgetChannels }, null, 'PUT'),
  )

  const updateSequence = (newWidgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) => {
    const { data } = queryClient.getQueryData<any>(['widget/widgetChannels', widgetId])
    const oldWidgetChannel: WidgetChannelType[] = data

    queryClient.setQueryData(['widget/widgetChannels', widgetId], {
      data: newWidgetChannels,
    })

    const newArray: UpdateSequenceProps[] = []
    oldWidgetChannel?.map((widgetChannel: WidgetChannelType, i: number) => {
      if (i !== oldIndex && ((i >= oldIndex && i <= newIndex) || (i >= newIndex && i <= oldIndex))) {
        if (oldIndex < newIndex) {
          newArray.push({ id: widgetChannel.id, sequence: oldWidgetChannel[i - 1].sequence })
        } else if (oldIndex > newIndex) {
          newArray.push({ id: widgetChannel.id, sequence: oldWidgetChannel[i + 1].sequence })
        }
      }
    })
    newArray.push({ id: oldWidgetChannel[oldIndex].id, sequence: oldWidgetChannel[newIndex].sequence })

    mutateAsync(newArray)
  }

  return {
    updateWidgetChannelsOrder: (newWidgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) =>
      updateSequence(newWidgetChannels, newIndex, oldIndex),
    isWidgetChannelOrderUpdating: isLoading,
  }
}
