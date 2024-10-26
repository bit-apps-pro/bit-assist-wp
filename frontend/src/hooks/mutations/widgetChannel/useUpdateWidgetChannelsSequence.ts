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

  const updateSequence = (newWidgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) => {
    const { data } = queryClient.getQueryData<any>(['widget/widgetChannels', widgetId])
    const oldWidgetChannel: WidgetChannelType[] = data

    // Update the cache with new widget channels
    queryClient.setQueryData(['widget/widgetChannels', widgetId], {
      data: newWidgetChannels,
    })

    // Determine the moved item and create a new array to store only changed sequences
    const newArray: UpdateSequenceProps[] = []

    // Loop through each item and determine if sequence has changed
    oldWidgetChannel.forEach((channel, index) => {
      let newSequence = index

      // Case when item was shifted downwards (oldIndex < newIndex)
      if (oldIndex < newIndex && index >= oldIndex && index <= newIndex) {
        newSequence = index === oldIndex ? newIndex : index - 1
      }
      // Case when item was shifted upwards (oldIndex > newIndex)
      else if (oldIndex > newIndex && index >= newIndex && index <= oldIndex) {
        newSequence = index === oldIndex ? newIndex : index + 1
      }

      // Add to newArray if sequence has changed
      if (newSequence !== index) {
        newArray.push({
          id: channel.id,
          sequence: newSequence,
        })
      }
    })

    // check if the array is empty or has no changes
    if (newArray.length < 2) return

    // Pass the updated array with only changed sequences to mutateAsync
    mutateAsync(newArray)
  }

  return {
    updateWidgetChannelsOrder: (newWidgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) =>
      updateSequence(newWidgetChannels, newIndex, oldIndex),
    isWidgetChannelOrderUpdating: isLoading,
  }
}
