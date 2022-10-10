import { WidgetChannelConfig } from '@globalStates/Interfaces'

export const widgetChannelValidate = (flowConfig: WidgetChannelConfig) => {
  if (flowConfig.title === '') {
    return { hasError: true, error: 'Title is required' }
  }
  return { hasError: false }
}
