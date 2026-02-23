import { type TColor } from '@atomik-color/core/dist/types'

export interface CardConfig {
  card_bg_color?: TColor
  card_text_color?: TColor
  faqs?: Faqs[]
  form_fields?: DynamicFormField[]
  isChatWidget?: boolean
  knowledge_bases?: KnowledgeBase[]
  maxId?: number
  send_mail_to?: string
  submit_button_text?: string
  success_message?: string
  webhook_url?: string
}

// channel interfaces
export interface Channel {
  icon: string
  name: string
}

export interface CreateWidgetInfo {
  name: string
}

export interface DynamicFormField {
  allow_multiple?: boolean
  allowed_file_type?: string
  field_type?: string
  id: number
  label?: string
  max_upload_size?: number
  rating_type?: string
  required?: boolean
  url?: string
}
export interface ExcludePages {
  condition: string
  url: string
  visibility: string
}
export interface Faqs {
  description?: string
  id: number
  title: string
}
export interface Flow {
  channel_name: string
  config: WidgetChannelConfig
  sequence?: number
  step: number
  widget_id: string
}
export interface IframeOptionsType {
  aspect_ratio?: string
  height?: string
  scrollbar?: boolean
  width?: string
}
export interface KnowledgeBase {
  description?: string
  id: number
  title: string
}

export interface Option {
  label: string
  value: string
}

export interface OrderDetails {
  shipping_status?: string
  total_amount?: number
  total_item?: number
}

export interface ResponseFileType {
  originalName: string
  uniqueName: string
}

// react select search
export interface SelectSearchOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  disabled?: boolean
  items?: SelectSearchOption[]
  name: string
  type?: string
  value?: number | string
}
// logged in user state
export interface UserStateType {
  _id?: string
  email?: string
  enableAffiliate?: boolean | null
  name?: string
  puid?: string
  referId?: string
  role?: string
}
export interface Widget {
  active: boolean
  business_hours: BusinessHours[]
  call_to_action: CallToAction | null
  created_at: string
  custom_css?: string
  delete_responses: DeleteResponses
  domains: string[]
  exclude_pages: ExcludePages[]
  hide_credit: boolean
  id: string
  initial_delay: number
  integrations: Integrations[]
  name: string
  page_scroll: number
  status: boolean
  store_responses: boolean
  styles: Styles | undefined
  widget_behavior: number
}
// flow interfaces
export interface WidgetChannelConfig {
  card_config?: CardConfig
  channel_icon?: string
  channel_show_on?: (number | string)[]
  hide_after_office_hours?: boolean
  icon?: string
  iframe_options?: IframeOptionsType
  message?: string
  open_window_action?: string
  order_details?: (number | string)[]
  phone_number?: string
  store_responses?: boolean
  title: string
  unique_id?: string
  url?: string
  wp_post_types?: string[]
}

export interface WidgetChannelType {
  channel_id: string
  channel_name: string
  config: WidgetChannelConfig
  id: number
  sequence: number
  status?: boolean
  widget_id: string
}
export interface WidgetResponse {
  created_at: string
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
  widget_channel_id: string
}
interface AnimationDelay {
  delay?: number
  text?: string
}
interface BusinessHours {
  day: string
  end?: string
  start?: string
}

interface CallToAction {
  delay?: number
  text?: string
}

interface DeleteResponses {
  delete_after?: number
  is_enabled?: boolean
}

interface Integrations {
  name: string
}

// widget interfaces
interface Styles {
  animation_active?: number
  animation_delay?: AnimationDelay | null
  animation_type?: number
  badge_active?: number
  badge_color?: TColor
  bottom?: number
  color?: TColor
  customImage?: string
  google_analytics?: number
  icon?: string
  iconUrl?: string
  left?: number
  position?: string
  right?: number
  shape?: string
  size?: number
  top?: number
  widget_show_on?: (number | string)[]
  widget_style?: number | string
}
