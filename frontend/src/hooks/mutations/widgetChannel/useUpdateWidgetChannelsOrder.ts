import { WidgetChannelType } from '@globalStates/Interfaces'
import request from '@utils/request'
import { debounce } from 'lodash'
import { useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'

export default function useUpdateWidgetChannelOrder() {
  const { widgetId } = useParams()
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    (widgetChannels: WidgetChannelType[]) => request('/api/widgetChannel/updateOrder', { widgetChannels }),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['widgetChannels', widgetId])
      },
    },
  )

  const setWidgetChannelsOrder = (widgetChannels: WidgetChannelType[]) => {
    queryClient.setQueryData(['widgetChannels', widgetId], {
      data: widgetChannels,
    })
  }

  const debounceUpdateWidget = useRef(
    debounce(async (widgetChannels, newIndex, oldIndex) => {
      const newArray = []
      widgetChannels.filter((widgetChannel: WidgetChannelType, i: number) => {
        if ((i >= oldIndex && i <= newIndex) || (i >= newIndex && i <= oldIndex)) {
          newArray.push({ ...widgetChannel, sequence: i + 1 })
        }
      })
      await mutateAsync(newArray)
    }, 3000),
  ).current

  useEffect(() => () => {
    debounceUpdateWidget.cancel()
  }, [debounceUpdateWidget])

  return {
    updateWidgetChannelsOrder: (widgetChannels: WidgetChannelType[], newIndex: number, oldIndex: number) => {
      setWidgetChannelsOrder(widgetChannels)
      debounceUpdateWidget(widgetChannels, newIndex, oldIndex)
    },
    isWidgetChannelOrderUpdating: isLoading,
  }
}
