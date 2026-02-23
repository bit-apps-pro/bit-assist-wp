import { __ } from '@helpers/i18nwrap'

export const FreeLimitsDefault = {
  channel: 2,
  widget: 1
}

export const defaultCreateWidgetInfo = () => ({ name: __('Untitled Widget') })

export const FlowDefault = {
  channel_id: '',
  channel_name: '',
  config: { title: __('') },
  sequence: 0,
  step: 1,
  widget_id: ''
}

export const WidgetDefault = {
  active: false,
  business_hours: [],
  call_to_action: {
    delay: 0,
    text: undefined
  },
  created_at: '',
  custom_css: undefined,
  delete_responses: {
    delete_after: undefined,
    is_enabled: false
  },
  domains: [],
  exclude_pages: [],
  hide_credit: false,
  id: '',
  initial_delay: 0,
  integrations: [],
  name: '',
  page_scroll: 0,
  status: true,
  store_responses: true,
  styles: {
    badge_active: 0,
    badge_color: undefined,
    color: undefined,
    icon: undefined,
    position: undefined,
    shape: undefined
  },
  timezone: '',
  widget_behavior: 1
}
