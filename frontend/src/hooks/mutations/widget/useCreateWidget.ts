import { str2Color } from '@atomik-color/core'
import { defaultCreateWidgetInfo } from '@globalStates/DefaultStates'
import { type CreateWidgetInfo } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation, useQueryClient } from 'react-query'

export default function useCreateWidget(
  closeCreateWidgetModal: () => void,
  setCreateWidgetInfo: (info: CreateWidgetInfo) => void
) {
  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(
    async (widgetInfo: CreateWidgetInfo) =>
      request('widgets', { ...widgetInfo, color: str2Color('#00ffa3') }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
        closeCreateWidgetModal()
        setCreateWidgetInfo(defaultCreateWidgetInfo())
      }
    }
  )

  return {
    createWidget: (widgetInfo: CreateWidgetInfo) => mutateAsync(widgetInfo),
    isWidgetCreating: isLoading
  }
}
