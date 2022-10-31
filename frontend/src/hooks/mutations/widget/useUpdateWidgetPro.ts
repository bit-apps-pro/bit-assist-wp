import { Widget } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation } from 'react-query'

export default function useUpdateWidgetPro() {
  const { mutateAsync, isLoading } = useMutation(
    async (widget: Widget) => request(`widgetsPro/${widget.id}`, widget, null, 'PUT'),
  )

  return {
    updateWidget: (widget: Widget) => mutateAsync(widget),
    isWidgetUpdating: isLoading,
  }
}
