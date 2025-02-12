import { type WidgetChannelConfig } from '@globalStates/Interfaces'

export const widgetChannelValidate = (flowConfig: WidgetChannelConfig) => {
  if (flowConfig.title === '') {
    return { error: 'Title is required', hasError: true }
  }
  return { hasError: false }
}

// export const otherValidate = (flowConfig: WidgetChannelConfig) => ({ hasError: false })
