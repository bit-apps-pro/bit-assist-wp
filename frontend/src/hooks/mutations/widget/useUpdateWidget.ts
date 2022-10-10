import { Widget } from '@globalStates/Interfaces'
import request from '@utils/request'
import { useMutation } from 'react-query'

export default function useUpdateWidget() {
  const { mutateAsync, isLoading } = useMutation((widget: Widget) => request('/api/widget/update', { widget }))

  return {
    updateWidget: (widget: Widget) => mutateAsync(widget),
    isWidgetUpdating: isLoading,
  }
}
