import {
  $,
  createElm,
  globalAppend,
  globalClassListAdd,
  globalClassListContains,
  globalClassListRemove,
  globalEventListener,
  globalInnerHTML,
  globalInnerText,
  globalQuerySelectorAll,
  globalSetAttribute,
} from '../utils/Helpers.js'
import { __ } from '@wordpress/i18n'

export const custom_form = {
  renderForm(widgetChannel) {
    const widgetThis = this

    widgetThis.hideChannels()
    widgetThis.renderCard()
    widgetThis.setCardStyle(widgetChannel.config)
    const cardConfig = widgetChannel.config?.card_config

    // Render form
    widgetThis.formBody = createElm('form', { id: 'formBody', method: 'POST' })
    const dynamicFieldsDiv = createElm('div', { id: 'dynamicFields' })
    const hiddenInput = createElm('input', {
      type: 'hidden',
      name: 'widget_channel_id',
      value: widgetChannel.id,
    })
    const submitButton = createElm('button', { type: 'submit' })
    globalInnerText(submitButton, cardConfig?.submit_button_text || __('Submit', 'bit-assist'))

    globalAppend(widgetThis.formBody, [dynamicFieldsDiv, hiddenInput, submitButton])

    globalInnerHTML(widgetThis.cardBody, '')
    globalAppend(widgetThis.cardBody, widgetThis.formBody)

    globalEventListener(widgetThis.formBody, 'submit', e => custom_form.formSubmitted(widgetThis, e))
    custom_form.createAllFields(cardConfig?.form_fields)
  },

  createAllFields(fields) {
    const dynamicFields = $('#dynamicFields')

    let flag = false
    fields?.forEach((field) => {
      if (field.field_type === 'file' && !flag) {
        globalSetAttribute($('#formBody'), 'enctype', 'multipart/form-data')
        flag = true
      }

      if (field.field_type === 'rating') {
        custom_form.createRatingField(field, dynamicFields, 'rating')
      }
      else if (field.field_type === 'feedback') {
        custom_form.createRatingField(field, dynamicFields, 'feedback')
      }
      else {
        custom_form.createTextField(field, dynamicFields)
      }
    })
  },

  createRatingField(field, dynamicFields, filedType) {
    const randomId = Math.floor(Math.random() * 100000000)
    const name = field.label.toLowerCase().replace(/ /g, '_')
    const wrapper = createElm('div', { class: filedType })

    if (filedType === 'rating') {
      globalClassListAdd(wrapper, field.rating_type)
    }

    let types = []
    if (filedType === 'feedback') {
      types = ['bug', 'suggest', 'love']
    }
    else if (field.rating_type === 'star') {
      types = ['5 star', '4 star', '3 star', '2 star', '1 star']
    }
    else {
      types = ['sad', 'confused', 'happy']
    }

    const typeLabels = { 'bug': __('Bug', 'bit-assist'), 'suggest': __('Suggest', 'bit-assist'), 'love': __('Love', 'bit-assist'), 'sad': __('Sad', 'bit-assist'), 'confused': __('Confused', 'bit-assist'), 'happy': __('Happy', 'bit-assist'), '5 star': __('5 star', 'bit-assist'), '4 star': __('4 star', 'bit-assist'), '3 star': __('3 star', 'bit-assist'), '2 star': __('2 star', 'bit-assist'), '1 star': __('1 star', 'bit-assist') }

    types.forEach((type) => {
      const fieldId = `${name}_${type.replace(/ /g, '_')}_${randomId}`
      const displayLabel = typeLabels[type] || type

      const inputElm = createElm('input', { type: 'radio', name, value: type, id: fieldId })
      if (field.required) {
        globalSetAttribute(inputElm, 'required', '')
      }

      const labelElm = createElm('label', { title: displayLabel, for: fieldId, class: type })
      if (filedType === 'feedback') {
        globalInnerHTML(labelElm, displayLabel)
        const feedbackIcon = createElm('div', { class: 'feedback-icon' })
        labelElm.prepend(feedbackIcon)
      }

      globalAppend(wrapper, [inputElm, labelElm])
    })
    globalAppend(dynamicFields, wrapper)
  },

  createTextField(field, dynamicFields) {
    const fieldInput = createElm(field.field_type === 'textarea' ? 'textarea' : 'input')

    globalSetAttribute(
      fieldInput,
      'name',
      `${field.label.toLowerCase().replace(/ /g, '_')}${field?.allow_multiple ? '[]' : ''}`,
    )
    globalSetAttribute(fieldInput, 'placeholder', field.label + (field.required ? '' : __(' (optional)', 'bit-assist')))
    if (field.required) {
      globalSetAttribute(fieldInput, 'required', '')
    }

    if (field.field_type === 'GDPR') {
      custom_form.gdprField(field, dynamicFields, fieldInput)
      return
    }

    globalClassListAdd(fieldInput, 'formControl')
    globalSetAttribute(fieldInput, 'type', field.field_type)

    if (field.field_type === 'file') {
      custom_form.fileField(field, dynamicFields, fieldInput)
      return
    }
    globalAppend(dynamicFields, fieldInput)
  },

  fileField(field, dynamicFields, fieldInput) {
    if (field?.allow_multiple) {
      globalSetAttribute(fieldInput, 'multiple', '')
    }

    const inputWrap = createElm('div', { class: 'formControl customFile' })

    const customFileInput = createElm('div', { class: 'cfit' })
    const customFileInputBtn = createElm('button', { class: 'cfit-btn', type: 'button' })
    globalInnerText(customFileInputBtn, __('Attach File', 'bit-assist'))
    const customFileInputTitle = createElm('div', { class: 'cfit-title' })
    globalInnerText(customFileInputTitle, __('No file chosen', 'bit-assist'))

    globalAppend(customFileInput, [customFileInputBtn, customFileInputTitle])
    globalAppend(inputWrap, [customFileInput, fieldInput])
    globalAppend(dynamicFields, inputWrap)

    globalEventListener(customFileInputBtn, 'click', () => fieldInput.click())
    globalEventListener(fieldInput, 'change', (e) => {
      let fileName = __('No file chosen', 'bit-assist')
      const fileLength = e.target.files.length
      if (fileLength > 0) {
        fileName = fileLength === 1 ? e.target.files[0].name : `${fileLength} ${__('files', 'bit-assist')}`
      }
      globalInnerText(customFileInputTitle, fileName)
    })
  },

  gdprField(field, dynamicFields, fieldInput) {
    globalSetAttribute(fieldInput, 'type', 'checkbox')

    const link = createElm('a', { target: '_blank' })
    globalInnerHTML(link, field.label)
    if (field?.url) {
      link.href = field.url
    }

    const gdprContainer = createElm('div', { class: 'gdprContainer' })
    globalAppend(gdprContainer, [fieldInput, link])
    globalAppend(dynamicFields, gdprContainer)
  },

  async formSubmitted(widgetThis, e) {
    e.preventDefault()

    const submitBtn = e.target.querySelector('[type="submit"]')
    const oldText = submitBtn.textContent
    const formData = new FormData(e.target)

    try {
      globalInnerText(submitBtn, __('Sending...', 'bit-assist'))
      globalClassListAdd(submitBtn, 'disabled')
      const responseData = await fetch(`${widgetThis.apiEndPoint}/responses`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json())

      if (responseData?.status === 'success') {
        await custom_form.showToast(widgetThis, 'success', responseData?.data)
      }
      else {
        await custom_form.showToast(widgetThis, 'error', responseData?.data)
      }

      e.target.reset()
      globalQuerySelectorAll(e.target, '.cfit-title').forEach((title) => {
        globalInnerText(title, __('No file chosen', 'bit-assist'))
      })
      globalClassListRemove(submitBtn, 'disabled')
      globalInnerText(submitBtn, oldText)
    }
    catch (err) {
      console.log(err)
      await custom_form.showToast(widgetThis, 'error')
      e.target.reset()
      globalQuerySelectorAll(e.target, '.cfit-title').forEach((title) => {
        globalInnerText(title, __('No file chosen', 'bit-assist'))
      })
      globalClassListRemove(submitBtn, 'disabled')
      globalInnerText(submitBtn, oldText)
    }
  },

  async showToast(widgetThis, type, message) {
    if (!widgetThis.cardBody.contains(widgetThis.formBody)) {
      return
    }

    const toast = createElm('div', { class: `toast ${type}` })
    const toastContent = createElm('div', { class: 'toast-content' })
    const toastText = createElm('div', { class: 'toast-text' })

    const toastTextTitle = createElm('div', { class: 'toast-text-title' })
    toastTextTitle.textContent = type === 'success' ? __('Success', 'bit-assist') : __('Error', 'bit-assist')

    const toastTextBody = createElm('div', { class: 'toast-text-body' })
    toastTextBody.textContent = type === 'success' ? message : __('Something went wrong', 'bit-assist')

    globalAppend(toastText, [toastTextTitle, toastTextBody])
    globalAppend(toastContent, toastText)
    globalAppend(toast, toastContent)

    globalAppend(widgetThis.cardBody, toast)
    globalClassListAdd(widgetThis.formBody, 'hide')

    if (globalClassListContains(toast, 'success')) {
      toastTextTitle.style.color = widgetThis.selectedFormBg
    }

    await widgetThis.delay(10)
    if (!globalClassListContains(widgetThis.formBody, 'hide')) {
      return
    }

    widgetThis.cardBody.removeChild(toast)
    globalClassListRemove(widgetThis.formBody, 'hide')
  },
}
