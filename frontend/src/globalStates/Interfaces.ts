import { TColor } from '@atomik-color/core/dist/types'

// logged in user state
export interface UserStateType {
  name?: string
  email?: string
  puid?: string
  enableAffiliate?: null | boolean
  referId?: string
  role?: string
  _id?: string
}

// widget interfaces
interface Styles {
  color?: TColor
  position?: string
  icon?: string
  iconUrl?: string
  shape?: string
  size?: number
}
interface BusinessHours {
  day: string
  start?: string
  end?: string
}
interface ExcludePages {
  url: string
  visibility: string
  condition: string
}
interface Integrations {
  name: string
}
interface CallToAction {
  text?: string
  delay?: number
}
interface DeleteResponses {
  is_enabled?: boolean
  delete_after?: number
}
export interface Widget {
  id: string
  name: string
  styles: Styles | null
  domains: string[]
  business_hours: BusinessHours[]
  timezone: string
  exclude_pages: ExcludePages[]
  initial_delay: number
  page_scroll: number
  widget_behavior: number
  custom_css?: string
  call_to_action: CallToAction | null
  store_responses: boolean
  delete_responses: DeleteResponses
  status: boolean
  active: boolean
  integrations: Integrations[]
}

export interface CreateWidgetInfo {
  name: string
}

// channel interfaces
export interface Channel {
  name: string
  icon: string
}

// flow interfaces
export interface WidgetChannelConfig {
  title: string
  icon?: string
  url?: string
  unique_id?: string
  phone_number?: string
  message?: string
  card_config?: CardConfig
  channel_show_on?: (string | number)[]
  open_window_action?: string
  hide_after_office_hours?: boolean
  store_responses?: boolean
}
export interface CardConfig {
  maxId?: number
  card_bg_color?: TColor
  card_text_color?: TColor
  submit_button_text?: string
  success_message?: string
  isChatWidget?: boolean
  webhook_url?: string
  form_fields?: DynamicFormField[]
  faqs?: Faqs[]
  knowledge_bases?: KnowledgeBase[]
}
export interface DynamicFormField {
  id: number
  label?: string
  field_type?: string
  url?: string
  required?: boolean
}
export interface Faqs {
  id: number
  title: string
  description?: string
}
export interface KnowledgeBase {
  id: number
  title: string
  description?: string
}
export interface WidgetChannelType {
  id: string
  widget_id: string
  channel_id: string
  config: WidgetChannelConfig
  sequence: number
  status?: boolean
}
export interface WidgetResponse {
  id: string
  widget_channel_id: string
  response: any
  created_at: string
}
export interface Flow {
  step: number
  sequence?: number
  widget_id: string
  channel_name: string
  config: WidgetChannelConfig
}

// react select search
export type SelectSearchOption = {
  name: string
  value?: string | number
  type?: string
  items?: SelectSearchOption[]
  disabled?: boolean
  [key: string]: any
}

export type SelectedOptionValue = string | number
