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

  const { mutateAsync, isLoading } = useMutation(
    async (widgetChannels: UpdateSequenceProps[]) => request('widgetChannels/updateSequence', { widgetChannels }, null, 'PUT'),
  )

  const updateSequence = (widgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) => {
    queryClient.setQueryData(['widget/widgetChannels', widgetId], {
      data: widgetChannels,
    })

    const newArray: UpdateSequenceProps[] = []
    widgetChannels.map((widgetChannel: WidgetChannelType, i: number) => {
      if ((i >= oldIndex && i <= newIndex) || (i >= newIndex && i <= oldIndex)) {
        newArray.push({ id: widgetChannel.id, sequence: i + 1 })
      }
    })

    mutateAsync(newArray)
  }

  return {
    updateWidgetChannelsOrder: (widgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) => updateSequence(widgetChannels, newIndex, oldIndex),
    isWidgetChannelOrderUpdating: isLoading,
  }
}
