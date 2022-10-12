import { useMutation, useQueryClient } from 'react-query'
import request from '@utils/request'
import { CreateWidgetInfo } from '@globalStates/Interfaces'
import { defaultCreateWidgetInfo } from '@globalStates/DefaultStates'

export default function useCreateWidget(closeCreateWidgetModal: () => void, setCreateWidgetInfo: (info: CreateWidgetInfo) => void) {
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    async (widgetInfo: CreateWidgetInfo) => request('widgets', widgetInfo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('widgets')
        closeCreateWidgetModal()
        setCreateWidgetInfo(defaultCreateWidgetInfo)
      },
    },
  )

  return {
    createWidget: (widgetInfo: CreateWidgetInfo) => mutate(widgetInfo),
    isWidgetCreating: isLoading,
  }
}
