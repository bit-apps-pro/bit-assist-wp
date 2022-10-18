export const defaultCreateWidgetInfo = { name: 'Untitled Widget' }

export const FlowDefault = {
  step: 1, widget_id: '', channel_id: '', channel_name: '', config: { title: '' }, sequence: 0,
}

export const WidgetDefault = {
  id: '',
  name: '',
  styles: {
    color: undefined,
    position: undefined,
    icon: undefined,
    shape: undefined,
  },
  domains: [],
  business_hours: [],
  timezone: '',
  exclude_pages: [],
  initial_delay: 0,
  page_scroll: 0,
  widget_behavior: 1,
  custom_css: undefined,
  call_to_action: {
    text: undefined,
    delay: 0,
  },
  store_responses: true,
  delete_responses: {
    is_enabled: false,
    delete_after: undefined,
  },
  status: true,
  active: false,
  integrations: [],
}
