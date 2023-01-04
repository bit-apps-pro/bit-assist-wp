import {
	$,
	createElm,
	globalAppend,
	globalInnerHTML,
	globalEventListener,
	globalInnerText,
	globalSetAttribute,
	globalClassListAdd,
} from '../utils/Helpers.js'

export const mixinForm = {
	renderForm(widgetChannel) {
		this.hideChannels()
		this.renderCard()
		this.setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		// Render form
		this.formBody = createElm('form', { id: 'formBody', method: 'POST' })
		const dynamicFieldsDiv = createElm('div', { id: 'dynamicFields' })
		const hiddenInput = createElm('input', {
			type: 'hidden',
			name: 'widget_channel_id',
			value: widgetChannel.id,
		})
		const submitButton = createElm('button', { type: 'submit' })
		globalInnerText(submitButton, cardConfig?.submit_button_text)

		globalAppend(this.formBody, [dynamicFieldsDiv, hiddenInput, submitButton])

		globalInnerHTML(this.cardBody, '')
		globalAppend(this.cardBody, this.formBody)

		globalEventListener(this.formBody, 'submit', this.formSubmitted)
		this.createAllFields(cardConfig?.form_fields)
	},

	createAllFields(fields) {
		const dynamicFields = $('#dynamicFields')

		let flag = false
		fields?.forEach(field => {
			if (field.field_type === 'file' && !flag) {
				globalSetAttribute($('#formBody'), 'enctype', 'multipart/form-data')
				flag = true
			}

			if (field.field_type === 'rating') {
				this.createRatingField(field, dynamicFields, 'rating')
			} else if (field.field_type === 'feedback') {
				this.createRatingField(field, dynamicFields, 'feedback')
			} else {
				this.createTextField(field, dynamicFields)
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
		} else if (field.rating_type === 'star') {
			types = ['5 star', '4 star', '3 star', '2 star', '1 star']
		} else {
			types = ['sad', 'confused', 'happy']
		}

		types.forEach(type => {
			const fieldId = `${name}_${type.replace(/ /g, '_')}_${randomId}`

			const inputElm = createElm('input', { type: 'radio', name: name, value: type, id: fieldId })
			if (field.required) {
				globalSetAttribute(inputElm, 'required', '')
			}

			const labelElm = createElm('label', { title: type, for: fieldId, class: type })
			if (filedType === 'feedback') {
				globalInnerHTML(labelElm, `${type.charAt(0).toUpperCase() + type.slice(1)}`)
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
			`${field.label.toLowerCase().replace(/ /g, '_')}${!!field?.allow_multiple ? '[]' : ''}`,
		)
		globalSetAttribute(fieldInput, 'placeholder', field.label + (field.required ? '' : ' (optional)'))
		if (field.required) {
			globalSetAttribute(fieldInput, 'required', '')
		}

		if (field.field_type === 'GDPR') {
			this.gdprField(field, dynamicFields, fieldInput)
			return
		}

		globalClassListAdd(fieldInput, 'formControl')
		globalSetAttribute(fieldInput, 'type', field.field_type)

		if (field.field_type === 'file') {
			this.fileField(field, dynamicFields, fieldInput)
			return
		}
		globalAppend(dynamicFields, fieldInput)
	},

	fileField(field, dynamicFields, fieldInput) {
		if (!!field?.allow_multiple) {
			globalSetAttribute(fieldInput, 'multiple', '')
		}

		const inputWrap = createElm('div', { class: 'formControl customFile' })

		const customFileInput = createElm('div', { class: 'cfit' })
		const customFileInputBtn = createElm('button', { class: 'cfit-btn', type: 'button' })
		globalInnerText(customFileInputBtn, 'Attach File')
		const customFileInputTitle = createElm('div', { class: 'cfit-title' })
		globalInnerText(customFileInputTitle, 'No file chosen')

		globalAppend(customFileInput, [customFileInputBtn, customFileInputTitle])
		globalAppend(inputWrap, [customFileInput, fieldInput])
		globalAppend(dynamicFields, inputWrap)

		globalEventListener(customFileInputBtn, 'click', () => fieldInput.click())
		globalEventListener(fieldInput, 'change', function (e) {
			let fileName = 'No file chosen'
			const fileLength = e.target.files.length
			if (fileLength > 0) {
				fileName = fileLength === 1 ? e.target.files[0].name : `${fileLength} files`
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
}
