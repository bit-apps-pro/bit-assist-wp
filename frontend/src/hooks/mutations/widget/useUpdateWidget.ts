import { type Widget } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation } from 'react-query'

export default function useUpdateWidget() {
  const { isLoading, mutateAsync } = useMutation(async (widget: Widget) =>
    request(`widgets/${widget.id}/update`, widget)
  )

  return {
    isWidgetUpdating: isLoading,
    updateWidget: (widget: Widget) => mutateAsync(widget)
  }
}
