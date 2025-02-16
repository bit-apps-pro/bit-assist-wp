import { type Widget } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation } from 'react-query'

export default function useUpdateWidgetPro() {
  const { isLoading, mutateAsync } = useMutation(async (widget: Widget) =>
    request(`pro/widgets/${widget.id}/update`, widget)
  )

  return {
    isWidgetUpdating: isLoading,
    updateWidget: (widget: Widget) => mutateAsync(widget)
  }
}
